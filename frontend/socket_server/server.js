import { Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import { MongoClient } from 'mongodb';
import * as Y from 'yjs';

// Constants
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'demo-1-collabor8';
const collectionName = 'documents';
const port = 1234;
let connectionCount = 0;

// Initialize MongoDB
async function initializeDatabase() {
  try {
    await MongoClient.connect(mongoUrl);
    // const db = client.db(dbName);
    // await clearCollections(db);
    // await insertMockData(db);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB or insert mock data:', error);
  }
}

// Hocuspocus Server Configuration
// new HOcus()
const server = new Hocuspocus({
  port,
  extensions: [new Logger()],
  async onStoreDocument(context) {
    const projectId = context.document.name;
    console.log('OnStore -------->', projectId);
    const yMap = context.document.getMap('root');
    await handleStoreDocument(yMap, projectId);
  },
  async onLoadDocument(context) {
    const projectId = context.document.name;
    console.log('OnLoad -------->', projectId);
    // I want to load only metadata stored for this project
    await handleLoadDocument(context, projectId);
    console.log('Array loaded from house', Array.from(context.document.getMap('root')));
    return context.document
  },
  async afterLoadDocument(context) {
    console.log('AfterLoad -------->', context.document.getMap('root').get('main-file').toJSON());
  },
  onConnect: (context) => {
    handleConnect(context);
  },
  onDisconnect: (context) => {
    handleDisconnect(context);
  },
  onError: (context, error) => {
    console.error(`Error occurred: ${error.message}`);
  },
  onUpdate: (context) => {
    console.log(`Document updated in room: ${context.document.name}`);
  },
});

// Document Handlers
async function handleStoreDocument(yMap, projectId) {
  try {
    const metaArray = {};
    Array.from(yMap.entries()).map(([key, value]) => {
      if (key.endsWith('_metadata')) {
        metaArray[key] = value;
      }
    });
    const yTextArray = Array.from(yMap.entries()).map(([key, value]) => {
      if (!key.endsWith('_metadata')) {
        return { key, value };
      }
    }
    );

    console.log(Array.from(yTextArray.length));
    for (const [key, value] of Array.from(yMap.entries())) {
      await updateDocumentInDb(projectId, key, value, metaArray);
      console.log(yMap.get(`${key}_metadata`));
    }
  } catch (error) {
    console.error(`Failed to store document ${projectId}:`, error);
  }
}

async function insertProjectToDb(projectId) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  const collection = db.collection('projects');
  console.log('Inserting project:', projectId);
  const result = await collection.insertOne({
    project_id: projectId,
    children: [],
  });
  const project = await collection.findOne({ _id: result.insertedId });
  await client.close();
  return project;
}

async function loadprojectFromDb(projectId) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  const collection = db.collection('projects');
  let project = await collection.findOne({ projectId });
  if (!project) {
    // create a new project
    project = await insertProjectToDb(projectId);
  }
  await client.close();
  return project;
}

async function insertFileToDb(projectId, fileId, yText) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  const collection = db.collection('projects');
  const dbupdate = {
    file_id: fileId,
    project_id: projectId,
    file_content: yText.toDelta(),
  };

  await collection.updateOne(
    // Filter criteria
    { projectId: projectId },
    // Update operation
    { $push: { children: dbupdate } },
    // Options (optional)
    { upsert: true }
  );
  const project = await collection.findOne({
    project_id: projectId,
  });
  const file = project.children.find((child) => child.file_id === fileId);
  await client.close();
  return file;
}

async function insertDirToDb(projectId, dirId, yjs) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  const collection = db.collection('projects');

  // Create a new directory entry
  const newDir = {
    dir_id: dirId,
    parent: projectId,
    children: [],
  };

  // Loop through the Y.Map (yjs) to add children
  for (const [key, value] of yjs.entries()) {
    if (value instanceof Y.Text) {
      // Handle Y.Text (file)
      const newFile = {
        file_id: key,
        file_content: value.toDelta(), // Serialize Y.Text as Delta
      };
      newDir.children.push(newFile);
    } else if (value instanceof Y.Map) {
      // Handle Y.Map (directory)
      await insertDirToDb(projectId, key, value); // Recursive call to handle nested directories
      newDir.children.push({ dir_id: key });
    }
  }

  // Update the project with the new directory
  await collection.updateOne(
    { project_id: projectId },
    { $push: { children: newDir } },
    { upsert: true }
  );

  await client.close();
}


// updates the file content of existing file in the database
async function updateFileInDb(projectId, fileId, yText) {
  const client = await MongoClient.connect(mongoUrl);
  const db = client.db(dbName);
  const collection = db.collection('projects');
  const update = yText.toDelta(); // Saving the changes as delta rather than using encodeStateAsUpdate

  const result = await collection.updateOne(
    {
      projectId: projectId,
      'children.file_id': fileId, // Find the document and array element to update
    },
    {
      $set: {
        'children.$.file_content': update, // Update the file_content of the matched array element
      },
    }
  );

  if (result.matchedCount === 0) {
    console.error(`No file found with fileId: ${fileId} in projectId: ${projectId}`);
  } else {
    console.log(`File with fileId: ${fileId} updated successfully in projectId: ${projectId}`);
  }

  await client.close();

}


async function loadfileFromDb(projectId, fileId, yText) {
  const project = await loadprojectFromDb(projectId);
  let file = project.children.find((child) => child.file_id === fileId);
  if (!file) {
    file = await insertFileToDb(projectId, fileId, yText); // creation of a new file happens here
    yText.applyDelta(yText.toDelta()); // I don't think this makes any difference
  } else {
    const content = file.file_content;
    if (content) {
      yText.applyDelta(content);
    } else {
      console.error(`File content is undefined for fileId: ${fileId}`);
    }
    return file;
  }
}


async function loaddirfromDb(project_id, fileId, yjs) {
  const project = await loadprojectFromDb(projectId);
  let dir = project.children.find((child) => child.file_id === fileId);
  // If directory isn't found we create a new one and insert all children as new children
  if (!dir) {
    dir = await insertDirToDb(project_id, fileId, yjs); // creation of a new dir happens here saving all children under it
  } else {
    // loop through children and check it they're either new of not
    handleStoreDocument(yjs, fileId);
  }
}


async function updateDocumentInDb(projectId, key, value, metaArray) {
  if (key === null) {
    console.error('Cannot store date');
    return;
  }
  // console.log('Updating document:', value.toJSON());
  const fileId = key
  const yjs = value;
  console.log(`FileId: ${fileId}`);
  if (yjs instanceof Y.Text) {
    const fileMeta = metaArray[`${key}_metadata`];
    console.log('FileMeta:', fileMeta);
    if (fileMeta && fileMeta['new']) {
      // update the file from the database
      const file = await loadfileFromDb(projectId, fileId, yjs);
      fileMeta['new'] = false;
    } else {
      // normal behavior
      await updateFileInDb(projectId, fileId, yjs);
      console.log(`Document updated: ${projectId}/${fileId}`);
    }
  } else if (yjs instanceof Y.Map) {
    const dirMeta = metaArray[`${key}_metadata`];
    console.log('DirMeta:', dirMeta);
    if (dirMeta && dirMeta['new']) {
      // if dirmeta is new then all children are new as well
      await loaddirfromDb(projectId, fileId, yjs); // probably all children will end up here too
      dirMeta['new'] = false;
    } else {
      // normal behavior
      // update Dir in Db
      await updateFileInDb(projectId, fileId, yjs);
      console.log(`Document updated: ${projectId}/${fileId}`);
    }

  }
}

async function handleLoadDocument(context, projectId) {
  try {
    const yMap = context.document.getMap('root');
    const project = await loadprojectFromDb(projectId)

    if (project) {
      loadProjectFiles(yMap, project);
    } else {
      console.error(`Project not found: ${projectId}`);
      // create a new project
      await collection.insertOne({
        project_id: projectId,
        children: [],
      });

    }
  } catch (error) {
    console.error(`Failed to load document ${projectId}:`, error);
  }
}

function loadProjectFiles(yMap, project) {
  const files = [];
  console.log(project);
  traverseChildren(project.children, files);
  for (const file of files) {
    const fileId = file.file_id;
    const content = file.file_content;
    if (!content) {
      console.error(`File content is undefined for fileId: ${fileId}`);
      continue;
    }
    if (content) {
      const yText = new Y.Text();
      yText.applyDelta(content);
      console.log('YText:', yText.toJSON());
      yMap.set(fileId, yText);
    } else {
      console.error(`File content is undefined for fileId: ${fileId}`);
    }
  }
  // return ydoc
}

function traverseChildren(children, files) {
  for (const child of children) {
    if (child.file_id) {
      files.push(child);
    } else if (child.children) {
      traverseChildren(child.children, files);
    }
  }
}

// Connection Handlers
function handleConnect(context) {
  console.log('Awareness Context:', context.awareness);
  if (context.awareness) {
    const connectionId = context.connection?.id || 'unknown';
    const roomName = context.document?.name || 'unknown';
    const username = context.awareness.getLocalState()?.user?.name || 'unknown';

    connectionCount++;
    console.log(`Client connected: ${connectionId}`);
    console.log(`Room name: ${roomName}`);
    console.log(`Username: ${username}`);
    console.log(`Number of connected clients: ${connectionCount}`);
  } else {
    console.error('Awareness context is undefined');
  }
}

function handleDisconnect(context) {
  const connectionId = context.connection?.id || 'unknown';
  connectionCount--;
  console.log(`Client disconnected: ${connectionId}`);
  console.log(`Number of connected clients: ${connectionCount}`);
}

// Start Server
server
  .listen()
  .then(() => {
    console.log(`Hocuspocus server is running on port ${port}`);
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
  });

// Initialize database
initializeDatabase();
