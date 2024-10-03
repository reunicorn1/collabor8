import axios from "axios";
import chalk from "chalk";
import * as Y from "yjs";
import transformData from "./transform.js";
import HocuspocusServer from "./HocuspocusServer.js";

// Utility Functions
/**
 * Retrieves the NestJS server URL.
 * @returns {string} The NestJS server URL.
 */
function getNestServerUrl() {
  return HocuspocusServer.nestServerUrl;
}

// Connection Handlers
/**
 * Logs client connection information.
 * @param {object} context - The context object containing connection details.
 */
export function handleConnect(context) {
  const connectionId = context.connection?.id || "unknown";
  const roomName = context.document?.name || "unknown";
  console.info(
    chalk.blue(`Client connected: ${connectionId}, Room: ${roomName}`),
  );
}

/**
 * Logs client disconnection information.
 * @param {object} context - The context object containing connection details.
 */
export function handleDisconnect(context) {
  const connectionId = context.connection?.id || "unknown";
  console.info(chalk.blue(`Client disconnected: ${connectionId}`));
}

// Document Handlers
/**
 * Handles loading a document from the database.
 * @param {object} context - The context object containing document details.
 * @param {object} params - The parameters object containing token and username.
 * @param {string} params.token - Authorization token.
 * @param {string} params.username - Username associated with the document.
 */
export async function handleLoadDocument(context, { token, username }) {
  const projectId = context.document.name;
  const yMap = context.document.getMap(projectId);
  try {
    const nestServerUrl = getNestServerUrl();
    const project = await axios.get(
      `${nestServerUrl}/projects/${username}/${projectId}?depth=0`,
      {
        headers: {
          'x-api-key': `${token}`,
        },
      },
    );
    const transformedData = transformData(project.data[0]);
    yMap.set("filetree", transformedData);
  } catch (error) {
    console.error(chalk.red(`Failed to load project data: ${error.message}`));
  }
}

/**
 * Handles storing a document to the database.
 * @param {object} params - The parameters object containing token, projectId, and context.
 * @param {string} params.token - Authorization token.
 * @param {string} params.projectId - Project ID associated with the document.
 * @param {object} params.context - The context object containing document details.
 */
export async function handleOnStoreDocument({ token, projectId, context }) {
  const ymap = context.document.getMap(projectId);
  Array.from(ymap.entries()).forEach(async ([k, v]) => {
    if (!k.endsWith("_metadata") && v instanceof Y.Text) {
      const fileMeta = ymap.get(`${k}_metadata`);
      if (fileMeta && fileMeta["new"]) {
        await loadfileFromDb({
          fileMeta,
          projectId,
          fileId: k,
          yText: v,
          token,
        });
        fileMeta["new"] = false; // Mark as no longer new
      } else {
        await updateFileInDb(k, v, token);
      }
    }
  });
}

/**
 * Handles updates to a document.
 * @param {object} context - The context object containing update details.
 */
export async function handleUpdate(context) {
  const yMap = context.document.getMap("root");
  const projectId = context.document.name;
  const updateQueue = HocuspocusServer.instance.updateQueue;

  if (!updateQueue.has(projectId)) {
    updateQueue.set(projectId, new Map());
  }

  const projectUpdates = updateQueue.get(projectId);
  for (const [key, value] of yMap.entries()) {
    if (value instanceof Y.Map) {
      const fileContent = value.toString();
      projectUpdates.set(key, fileContent);
    }
  }
}

// Helper Functions for Document Storage
/**
 * Updates a file in the database.
 * @param {string} fileId - The ID of the file to update.
 * @param {Y.Text} yText - The Yjs Text object representing file content.
 * @param {string} token - Authorization token.
 */
async function updateFileInDb(fileId, yText, token) {
  const update = yText.toDelta();
  try {
    const nestServerUrl = getNestServerUrl();
    await axios.patch(
      `${nestServerUrl}/files/${fileId}`,
      { file_content: update },
      {
        headers: { 'x-api-key': `${token}` },
      },
    );
    console.info(chalk.green(`File ${fileId} updated successfully`));
  } catch (error) {
    console.error(
      chalk.red(`Failed to update file ${fileId}: ${error.message}`),
    );
  }
}

/**
 * Loads a file from the database and updates the Y.Text object if necessary.
 * @param {object} params - Parameters object containing fileMeta, projectId, fileId, yText, and token.
 * @param {object} params.fileMeta - Metadata of the file.
 * @param {string} params.projectId - Project ID associated with the file.
 * @param {string} params.fileId - File ID to be loaded from the database.
 * @param {Y.Text} params.yText - Yjs Text object to be updated with file content.
 * @param {string} params.token - Authorization token.
 */
async function loadfileFromDb({ fileMeta, projectId, fileId, yText, token }) {
  try {
    const nestServerUrl = getNestServerUrl();
    const file = await axios.get(`${nestServerUrl}/files/${fileId}`, {
      headers: { 'x-api-key': `${token}` },
    });

    const content = file.data.file_content;
    if (
      content &&
      JSON.stringify(yText.toDelta()) !== JSON.stringify(content)
    ) {
      yText.applyDelta(content);
    }
  } catch (err) {
    console.error(
      chalk.red(`Failed to load file ${fileId} from DB: ${err.message}`),
    );
  }
}
