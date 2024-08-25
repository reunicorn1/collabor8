import axios from "axios";
import dotenv from "dotenv";
import * as Y from "yjs";
import type { onLoadDocumentPayload } from '@hocuspocus/server';

dotenv.config();

type Context = onLoadDocumentPayload;

interface IHandler {
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
}

// TODO: refactor `newserver` file to this singleton later after deployment
/**
 * @class HandlerSingleton
 *
 */
class HandlerSingleton {
  private static _instance: HandlerSingleton | null = null;
  yMap: any; // Add a more specific type if possible
  projectId: string;
  token: string | null;
  username: string | null;

  static PORT = process.env.PORT || 1234;
  static URL = process.env.NEST_SERVER_URL || "http://localhost:3000/api/v1";

  constructor(context: Context) {
    if (HandlerSingleton._instance) {
      // guard condition
      // one isntance and only one instance of the class
      return HandlerSingleton._instance;
    }
    HandlerSingleton._instance = this;
    this.yMap = context.document;
    this.projectId = context.document.name;
    this.token = context.requestParameters.get('token');
    this.username = context.requestParameters.get('username');

  }

  static getInstance(): HandlerSingleton {
    return HandlerSingleton._instance!;
  }

  async onLoadDocument({ onSuccess = (data) => { }, onError = (data) => { } }: IHandler = {}) {
    try {
      const project = await axios.get(
        `${HandlerSingleton.URL}/projects/${this.username}/${this.projectId}?depth=0`,
        {
          headers: { Authorization: `Bearer ${this.token}` },
        }
      );
      onSuccess(project.data);
    } catch (err) {
      onError(err);
    }
  }

  async onConnect({ onSuccess = (data) => { }, onError = (data) => { } }: IHandler = {}) {
    // Implement connection handling
  }

  async onDisconnect({ onSuccess = (data) => { }, onError = (data) => { } }: IHandler = {}) {
    // Implement disconnection handling
  }

  async onChange({ onSuccess = (data) => { }, onError = (data) => { } }: IHandler = {}) {
    // Implement update handling
  }

  async onStoreDocument() {
    // Implement update handling
    // save by debounce
  }

  onError() {
    // Implement error handling
  }
}
export default HandlerSingleton;
