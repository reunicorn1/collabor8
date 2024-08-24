import { Hocuspocus } from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import Delta from "quill-delta";
import * as Y from "yjs";
import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";

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
 * `onUpdate`:
 *    1. udpate file content per project, PATCH reqeust DB
 *
 * **NOTE**:
 * - each route is protected so we need the token ✅️
 */

const project = {
  id: "66c96f56c67902d806265e16",
  type: "project",
  children: [
    {
      id: "66c96f56c67902d806265e17",
      name: "Directory_gc1hgp",
      type: "directory",
      children: [
        {
          id: "66c96f56c67902d806265e24",
          name: "Directory_5vp6x",
          type: "directory",
          children: [
            {
              id: "66c96f56c67902d806265e25",
              name: "Directory_t8pr8d",
              type: "directory",
              children: [
                {
                  id: "66c96f56c67902d806265e28",
                  name: "File_ql4zn6.txt",
                  type: "file",
                },
                {
                  id: "66c96f56c67902d806265e35",
                  name: "File_r2mpip.txt",
                  type: "file",
                },
                {
                  id: "66c96f57c67902d806265e41",
                  name: "File_lry5va.txt",
                  type: "file",
                },
                {
                  id: "66c96f57c67902d806265e43",
                  name: "File_3fuw5o.txt",
                  type: "file",
                },
                {
                  id: "66c96f57c67902d806265e47",
                  name: "File_i520ttg.txt",
                  type: "file",
                },
              ],
            },
            {
              id: "66c96f56c67902d806265e29",
              name: "File_u81oy.txt",
              type: "file",
            },
            {
              id: "66c96f57c67902d806265e3d",
              name: "File_k00ut.txt",
              type: "file",
            },
            {
              id: "66c96f57c67902d806265e3e",
              name: "File_7fnoyj.txt",
              type: "file",
            },
            {
              id: "66c96f57c67902d806265e46",
              name: "File_4nquv6.txt",
              type: "file",
            },
          ],
        },
        {
          id: "66c96f56c67902d806265e1b",
          name: "File_ynsygn.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e21",
          name: "File_1khnhp.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e22",
          name: "File_3njlo9.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e2a",
          name: "File_8n3wzq.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e2c",
          name: "File_ojo4p4.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e2e",
          name: "File_icxet.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e2f",
          name: "File_5u3f1o.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e31",
          name: "File_frigyr.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e33",
          name: "File_kstc4.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e34",
          name: "File_q5iuwk.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e37",
          name: "File_lq499.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e3c",
          name: "File_enbfmc.txt",
          type: "file",
        },
        {
          id: "66c96f57c67902d806265e3f",
          name: "File_21jvdd.txt",
          type: "file",
        },
        {
          id: "66c96f57c67902d806265e42",
          name: "File_b4fb4xh.txt",
          type: "file",
        },
      ],
    },
    {
      id: "66c96f56c67902d806265e18",
      name: "Directory_obkxr9",
      type: "directory",
      children: [
        {
          id: "66c96f56c67902d806265e19",
          name: "File_izp6cl.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e1c",
          name: "File_0s9ig.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e1d",
          name: "File_zwrpmb.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e1e",
          name: "File_3pcwni.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e1f",
          name: "File_2k3ygd.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e23",
          name: "File_hjs0v7.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e26",
          name: "File_0u8all.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e2b",
          name: "File_1di3h.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e2d",
          name: "File_64jlxk.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e30",
          name: "File_lm54b.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e32",
          name: "File_uuuuhd.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e36",
          name: "File_52f25l.txt",
          type: "file",
        },
        {
          id: "66c96f56c67902d806265e38",
          name: "File_9q8gao.txt",
          type: "file",
        },
        {
          id: "66c96f57c67902d806265e40",
          name: "File_mpev0m.txt",
          type: "file",
        },
        {
          id: "66c96f57c67902d806265e44",
          name: "File_1zckur.txt",
          type: "file",
        },
        {
          id: "66c96f57c67902d806265e45",
          name: "File_twki9b.txt",
          type: "file",
        },
      ],
    },
    {
      id: "66c96f56c67902d806265e1a",
      name: "File_8elznt.txt",
      type: "file",
    },
    {
      id: "66c96f56c67902d806265e20",
      name: "File_fwo4uo.txt",
      type: "file",
    },
    {
      id: "66c96f56c67902d806265e27",
      name: "File_ftqx5k.txt",
      type: "file",
    },
    {
      id: "66c96f56c67902d806265e39",
      name: "File_v0iif4.txt",
      type: "file",
    },
    {
      id: "66c96f56c67902d806265e3a",
      name: "File_ww8kzn.txt",
      type: "file",
    },
    {
      id: "66c96f56c67902d806265e3b",
      name: "File_a7jjj9.txt",
      type: "file",
    },
  ],
};

const textToDelta = (text) => new Delta().insert(text);

const server = new Hocuspocus({
  port,
  extensions: [new Logger()],
  async onLoadDocument(context) {
    const projectId = context.document.name;
    const token = context.requestParameters.get('token');
    console.log('_------------->', { token })
    try {
      await handleLoadDocument(context, token);

      // const ymap = context.document.getMap("root");
      //
      // function logYMapContents(yMap) {
      //   yMap.forEach((value, key) => {
      //     if (value instanceof Y.Map) {
      //       console.log(`Key: ${key} -> YMap:`, value);
      //       logYMapContents(value);
      //     } else if (value instanceof Y.Text) {
      //       console.log(`Key: ${key} -> YText:`, value.toString());
      //     } else {
      //       console.log(`Key: ${key} -> Value:`, value);
      //     }
      //   });
      // }
      // // ymap.set("filetree", project);
      //
      // logYMapContents(ymap);

      console.info(
        chalk.green(
          `Document loaded successfully for project ID: ${projectId}`,
        ),
      );
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
    console.info(
      chalk.yellow(`Document updated in room: ${context.document.name}`),
    );
    handleUpdate(context);
  },
});

const updateQueue = new Map(); // store updates for each project

async function handleLoadDocument(context, token) {
  const yMap = context.document.getMap("root");
  const projectId = context.document.name
  try {
    const project_ = await axios.get(`${nestServerUrl}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log({ project_ })
    yMap.set("filetree", project);
  } catch (err) {
    console.log({err})

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
          console.info(chalk.green(`Loaded content for file ID: ${id}`));
        } else {
          console.warn(chalk.yellow(`No content found for file ID: ${id}`));
        }
      } catch (error) {
        console.error(
          chalk.red(`Failed to load content for file ID: ${id}`, error),
        );
      }
    } else if (file.type === "dir") {
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
      console.info(chalk.green(`Queued update for file ID: ${key}`));
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

server
  .listen()
  .then(() => {
    console.info(chalk.green(`Hocuspocus server is running on port ${port}`));
  })
  .catch((error) => {
    console.error(chalk.red("Failed to start the server:", error));
  });
