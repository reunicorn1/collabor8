import { Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import Delta from 'quill-delta';
import * as Y from 'yjs';
import axios from 'axios';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 1234;
const nestServerUrl =
  process.env.NEST_SERVER_URL || 'http://localhost:3000/api/v1/files';
const updateInterval = 60000;

const project = {
  projectId: '4653',
  id: 0,
  children: [
    { type: 'file', id: 1, file_name: 'test.js', project_id: '4653' },
    {
      type: 'dir',
      id: 2,
      directory_name: 'testdir',
      project_id: '4653',
      children: [
        { type: 'file', id: 3, file_name: 'test2.js', project_id: '4653' },
        { type: 'file', id: 4, file_name: 'test3.js', project_id: '4653' },
      ],
    },
  ],
};

const textToDelta = (text) => new Delta().insert(text);

const server = new Hocuspocus({
  port,
  extensions: [new Logger()],
  async onLoadDocument(context) {
    const projectId = context.document.name;
    console.info(chalk.blue(`Loading document for project ID: ${projectId}`));
    try {
      await handleLoadDocument(context);
      const ymap = context.document.getMap('root');
      ymap.set('filetree', project);
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
      context.reject(500, 'Internal Server Error');
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

async function handleLoadDocument(context) {
  const yMap = context.document.getMap('root');
  await loadProjectToYMap(yMap, project);
}

async function loadProjectToYMap(yMap, project) {
  for (const file of project.children) {
    if (file.type === 'file') {
      const { id } = file;
      try {
        const response = await axios.get(`${nestServerUrl}/${id}`);
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
    } else if (file.type === 'dir') {
      const ySubMap = new Y.Map();
      yMap.set(file.id, ySubMap);
      await loadProjectToYMap(ySubMap, file);
    }
  }
}

async function handleUpdate(context) {
  const yMap = context.document.getMap('root');
  const projectId = context.document.name;

  if (!updateQueue.has(projectId)) {
    updateQueue.set(projectId, new Map());
  }

  const projectUpdates = updateQueue.get(projectId);

  for (const [key, value] of yMap.entries()) {
    if (value instanceof Y.Text) {
      const fileContent = value.toString();
      projectUpdates.set(key, fileContent);
      console.info(chalk.green(`Queued update for file ID: ${key}`));
    }
  }
}

// Function to process the batched updates
async function processBatchedUpdates() {
  for (const [projectId, fileUpdates] of updateQueue.entries()) {
    for (const [fileId, content] of fileUpdates.entries()) {
      const fileRecord = {
        file_content: content,
      };

      try {
        const response = await axios.patch(
          `${nestServerUrl}/${fileId}`,
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
setInterval(processBatchedUpdates, updateInterval);

function handleConnect(context) {
  const connectionId = context.connection?.id || 'unknown';
  const roomName = context.document?.name || 'unknown';
  console.info(
    chalk.blue(`Client connected: ${connectionId}, Room: ${roomName}`),
  );
}

function handleDisconnect(context) {
  const connectionId = context.connection?.id || 'unknown';
  console.info(chalk.blue(`Client disconnected: ${connectionId}`));
}

server
  .listen()
  .then(() => {
    console.info(chalk.green(`Hocuspocus server is running on port ${port}`));
  })
  .catch((error) => {
    console.error(chalk.red('Failed to start the server:', error));
  });
