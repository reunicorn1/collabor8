import { Hocuspocus } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import chalk from "chalk";
import dotenv from "dotenv";
import {
  handleLoadDocument,
  handleOnStoreDocument,
  handleConnect,
  handleDisconnect,
  handleUpdate,
} from "./serverHandlers.js";

dotenv.config();

/**
 * HocuspocusServer class handles the initialization and configuration of the Hocuspocus server.
 */
class HocuspocusServer {
  /**
   * Constructor for the HocuspocusServer class.
   * @returns {HocuspocusServer} Instance of the HocuspocusServer.
   */
  constructor() {
    if (HocuspocusServer.instance) {
      return HocuspocusServer.instance;
    }

    this.port = process.env.PORT || 1234;
    this.env = {
      development: process.env.NEST_SERVER_URL,
      production: process.env.NEST_SERVER_URL_PRO,
    };
    this.nestServerUrl = this.env[process.env.NODE_ENV] || this.env.development;

    this.updateQueue = new Map();

    this.server = new Hocuspocus({
      port: this.port,
      extensions: [new Logger()],
      onLoadDocument: this.onLoadDocument,
      onStoreDocument: this.onStoreDocument,
      onConnect: this.onConnect,
      onDisconnect: this.onDisconnect,
      onUpdate: this.onUpdate,
      onChange: this.onChange,
      onError: this.onError,
    });

    HocuspocusServer.instance = this;

    return this;
  }

  /**
   * Gets the URL of the NestJS server.
   * @returns {string} The NestJS server URL.
   */
  getNestServerUrl() {
    return this.nestServerUrl;
  }

  /**
   * Handles loading a document from the server.
   * @param {object} context - The context object containing the document details.
   */
  async onLoadDocument(context) {
    const projectId = context.document.name;
    const token = process.env.API_KEY;
    console.log(token);
    const username = context.requestParameters.get("username");

    try {
      console.info(
        chalk.green(`Document loaded successfully for project ID ${projectId}`),
      );
      console.log({ username, env: process.env.NODE_ENV });
      await handleLoadDocument(context, { token, username });
      return context.document;
    } catch (error) {
      console.error(
        chalk.red(`Failed to load document for project ID ${projectId}`, error),
      );
    }
  }

  /**
   * Handles a client connection.
   * @param {object} context - The context object containing connection details.
   */
  onConnect(context) {
    handleConnect(context);
  }

  /**
   * Handles a client disconnection.
   * @param {object} context - The context object containing connection details.
   */
  onDisconnect(context) {
    handleDisconnect(context);
  }

  /**
   * Handles errors occurring in the server.
   * @param {object} context - The context object containing error details.
   * @param {Error} error - The error object.
   */
  onError(context, error) {
    console.error(
      chalk.red(`Error occurred in context: ${context.document.name}`, error),
    );
  }

  /**
   * Handles updates to a document.
   * @param {object} context - The context object containing update details.
   */
  onUpdate(context) {
    handleUpdate(context);
  }

  /**
   * Logs changes made to a document.
   * @param {object} context - The context object containing change details.
   */
  onChange(context) {
    console.info(
      chalk.green(`Document changed for project ID ${context.document.name}`),
    );
  }

  /**
   * Handles storing a document to the server.
   * @param {object} context - The context object containing document details.
   */
  async onStoreDocument(context) {
    const projectId = context.document.name;
    const token = process.env.API_KEY;
    await handleOnStoreDocument({ token, projectId, context });
  }

  /**
   * Starts the Hocuspocus server.
   */
  start() {
    this.server
      .listen()
      .then(() => {
        console.info(
          chalk.green(`Hocuspocus server is running on port ${this.port}`),
        );
      })
      .catch((error) => {
        console.error(chalk.red("Failed to start Hocuspocus server", error));
      });
  }
}

const instance = new HocuspocusServer();

// mark insance as read only
Object.freeze(instance);

instance.start();

export default instance;
