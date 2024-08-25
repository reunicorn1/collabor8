import { Hocuspocus } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import Delta from "quill-delta";
import * as Y from "yjs";
import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";
import transformData from "./transform.js";

dotenv.config();

const port = process.env.PORT || 1234;
const nestServerUrl =
  process.env.NEST_SERVER_URL || "http://localhost:3000/api/v1";
const updateInterval = 60000;

/**
 * TODO:
 * `onLoadDocument`:
 *    1. should load project from GET reqest DB, if not exist create it 😈️
 *    2. tranform data, then set the fileTree accordingly
r* `onUpdate`:
 *    1. udpate file content per project, PATCH reqeust DB
 *
 * **NOTE**:
 * - each route is protected so we need the token ✅️
 */

const textToDelta = (text) => new Delta().insert(text);

const server = new Hocuspocus({
  port,
  extensions: [new Logger()],
  async onLoadDocument(context) {
    const projectId = context.document.name;
    const token = context.requestParameters.get('token');
    const username = context.requestParameters.get('username');
    try {
      console.info(
        chalk.green(
          `Document loaded successfully for project ID: ${projectId}`,
        ),
      );
      await handleLoadDocument(context, { token, username });
      return context.document

    } catch (error) {
      console.error(
        chalk.red(
          `Failed to load document for project ID: ${projectId}`,
          error,
        ),
      );
      //context.reject(500, "Internal Server Error");
    }
  },
  onConnect(context) {
    handleConnect(context);
  },
  onDisconnect(context) {
    handleDisconnect(context);
  },
  onError(context, error) {
    console.error(
      chalk.red(`Error occurred in context: ${context.document.name}`, error),
    );
  },
  onUpdate(context) {
    //console.info(
    //  chalk.yellow(`Document updated in room: ${context.document.name}`),
    //);
    //handleUpdate(context);
  },
  onChange(context) {
    console.log('-------OnChange-------->')
    //console.log({ delta: ytext.toDelta() })
    //console.log('--------onChange-------->', {data})
  },
  async onStoreDocument(context) {
    console.log('-----onSoreDocument---------->')
    const ymap = context.document.getMap('root')
    const token = context.requestParameters.get('token');
    Array.from(ymap.entries()).forEach(async ([k, v]) => {
      if (!k.endsWith('_metadata') && v instanceof Y.Text) {
        //a, abc, abc;adf
        // do smth with the file
        // handler(v, ymap.get(`${k._metadata}`)
        console.log('----->', v.toString())
        await handleOnStoreDocument({
          token,
          projectId: context.document.name,
          yText: v,
          fileMeta: ymap.get(`${k}_metadata`)
        });
      }
    })
  }
});

const updateQueue = new Map(); // store updates for each project

async function handleLoadDocument(context, { token, username }) {
  const yMap = context.document.getMap("root");
  const projectId = context.document.name
  try {
    const project = await axios.get(`${nestServerUrl}/projects/${username}/${projectId}?depth=0`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log( project.data )

    //console.log({ user: username })
    const transformedData = transformData(project.data[0]);
    yMap.set("filetree", transformedData);
  } catch (err) {
    //console.log({ resp: err.response.message })

  }
  // const token = yMap.getMap("accessToken");
  // console.log("accessToken------------->", token);
  // await loadProjectToYMap(yMap, project);
}

async function loadProjectToYMap(yMap, project) {
  for (const file of project.children) {
    if (file.type === "file") {
      const { id } = file;
      try {
        const response = await axios.get(`${nestServerUrl}/files/${id}`);
        const content = response.data.file_content;

        if (content) {
          const yText = new Y.Text();
          const delta = textToDelta(content);
          yText.applyDelta(delta);
          yMap.set(id, yText);
          //console.info(chalk.green(`Loaded content for file ID: ${id}`));
        } else {
          //console.warn(chalk.yellow(`No content found for file ID: ${id}`));
        }
      } catch (error) {
        //console.error(
        //  chalk.red(`Failed to load content for file ID: ${id}`, error),
        //);
      }
    } else if (file.type === "directory") {
      const ySubMap = new Y.Map();
      yMap.set(file.id, ySubMap);
      await loadProjectToYMap(ySubMap, file);
    }
  }
}

async function handleUpdate(context) {
  const yMap = context.document.getMap("root");
  const projectId = context.document.name;

  if (!updateQueue.has(projectId)) { // custom queue
    updateQueue.set(projectId, new Map());
  }

  const projectUpdates = updateQueue.get(projectId); // return map object represents wt ??

  for (const [key, value] of yMap.entries()) {
    if (value instanceof Y.Text) {
      const fileContent = value.toString();
      // key represents file id (and files only)
      projectUpdates.set(key, fileContent);
      //console.info(chalk.green(`Queued update for file ID: ${key}`));
    }
  }
}

// Function to process the batched updates
async function processBatchedUpdates() {
  // TODO:
  // refactor this to real Queue
  // by eleminating nesting for-loop
  for (const [projectId, fileUpdates] of updateQueue.entries()) {
    for (const [fileId, content] of fileUpdates.entries()) {
      const fileRecord = {
        file_content: content,
      };

      try {
        const response = await axios.patch(
          `${nestServerUrl}/files/${fileId}`,
          fileRecord,
        );
        console.info(chalk.green(`File updated successfully: ID ${fileId}`));
      } catch (error) {
        console.error(
          chalk.red(
            `Failed to update file ID: ${fileId}`,
            error.response ? error.response.data : error.message,
          ),
        );
      }
    }
  }

  // clear after processing
  updateQueue.clear();
}

// set interval to process batched updates
// updates request on intervals to DB/nest api
setInterval(processBatchedUpdates, updateInterval);

function handleConnect(context) {
  const connectionId = context.connection?.id || "unknown";
  const roomName = context.document?.name || "unknown";
  console.info(
    chalk.blue(`Client connected: ${connectionId}, Room: ${roomName}`),
  );
}

function handleDisconnect(context) {
  const connectionId = context.connection?.id || "unknown";
  console.info(chalk.blue(`Client disconnected: ${connectionId}`));
}

// update
async function handleOnStoreDocument({ token, projectId, yText, fileMeta }) {
  // console.log('Updating document:', value.toJSON());
  console.log('==============>', { fileMeta })
  const fileId = fileMeta.id
  //const yText = value;
  console.log(`FileId: ${fileId}`);
  //const fileMeta = metaArray[`${key}_metadata`]; // Is metadata never stored in database a9lan!
  console.log('FileMeta:', fileMeta);
  if (fileMeta && fileMeta['new']) {
    // update the file from the database
    const file = await loadfileFromDb({ fileMeta, projectId, fileId, yText, token });
    fileMeta['new'] = false;
  } else {
    // normal behavior
    await updateFileInDb(fileId, yText);
    console.log(`Document updated: ${projectId}/${fileId}`);
  }
}

async function loadfileFromDb({ fileMeta, projectId, fileId, yText, token }) {
  try {
    let file = await axios.get(
      `${nestServerUrl}/files/${fileId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const content = file.file_content;
    if (!content) {
      yText.insert('');
    } else {
      yText.applyDelta(content);
    }
  } catch (err) {
    // file not found
    const { name, parent_id } = fileMeta
    const file = await axios.post(`${nestServerUrl}/files`,
      {
        name, parent_id, project_id: projectId
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      });
    // mutate fileMeta id
    yText.applyDelta(yText.toDelta());
  }
}

async function updateFileInDb(fileId, yText) {
  const update = yText.toDelta(); // Saving the changes as delta rather than using encodeStateAsUpdate

  try {
    const result = await axios.patch(`${nestServerUrl}/files/${fileId}`, { file_content: update })
  } catch (err) {
    //console.error('-------------->', { err })
  }
}

server
  .listen()
  .then(() => {
    console.info(chalk.green(`Hocuspocus server is running on port ${port}`));
  })
  .catch((error) => {
    console.error(chalk.red("Failed to start the server:", error));
  });
