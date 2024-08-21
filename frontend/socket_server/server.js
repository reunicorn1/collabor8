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

// Mock data
// const mockUser = {
//   user_id: '123e4567-e89b-12d3-a456-426614174000',
//   username: 'johndoe',
//   email: 'johndoe@example.com',
//   environment_id: '123e4567-e89b-12d3-a456-426614174001',
//   created_at: '2024-08-12T00:00:00Z',
//   updated_at: '2024-08-12T00:00:00Z',
// };

// const mockProjects = [
//   {
//     project_id: '123e4567-e89b-12d3-a456-426614174002',
//     project_name: 'Sample Project 1',
//     created_at: '2024-08-12T00:00:00Z',
//     updated_at: '2024-08-12T00:00:00Z',
//     parent_id: null,
//     children: [
//       {
//         directory_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
//         directory_name: 'root',
//         parent_id: null,
//         created_at: '2024-08-12T00:00:00Z',
//         children: [
//           {
//             directory_id: '82be4d5c-7f77-4e8d-9b0d-6f19f55c89a7',
//             directory_name: 'Folder 1',
//             parent_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
//             created_at: '2024-08-12T00:00:00Z',
//             children: [
//               {
//                 file_id: 'cc5f70e4-c13c-41c7-9f47-61d1cfab2e79',
//                 file_name: 'file1.js',
//                 directory_id: '82be4d5c-7f77-4e8d-9b0d-6f19f55c89a7',
//                 file_content: 'console.log("Hello World");',
//                 created_at: '2024-08-12T00:00:00Z',
//                 updated_at: '2024-08-12T00:00:00Z',
//                 parent_id: '82be4d5c-7f77-4e8d-9b0d-6f19f55c89a7',
//               },
//             ],
//           },
//           {
//             directory_id: '9e7d14c8-9db4-4d92-bf36-27463b0890a6',
//             directory_name: 'Folder 2',
//             parent_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
//             created_at: '2024-08-12T00:00:00Z',
//             children: [],
//           },
//         ],
//       },
//       {
//         file_id: '1c9d7e54-67c1-4d7e-9e4b-02b6eecf569b',
//         file_name: 'README.md',
//         directory_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
//         file_content: '# Sample Project\nThis is a sample project.',
//         created_at: '2024-08-12T00:00:00Z',
//         updated_at: '2024-08-12T00:00:00Z',
//         parent_id: 'd1c2c74b-dbd4-4f78-b8f1-df72dcf50707',
//       },
//     ],
//     shared_with: [
//       {
//         user_id: '123e4567-e89b-12d3-a456-426614174000',
//         access_level: 'read',
//       },
//     ],
//   },
//   {
//     project_id: '123e4567-e89b-12d3-a456-426614174003',
//     project_name: 'Sample Project 2',
//     created_at: '2024-08-12T00:00:00Z',
//     updated_at: '2024-08-12T00:00:00Z',
//     parent_id: null,
//     children: [
//       {
//         directory_id: 'd3a34e23-9a6d-4b1c-bf26-60acdb84011f',
//         directory_name: 'root',
//         parent_id: null,
//         created_at: '2024-08-12T00:00:00Z',
//         children: [
//           {
//             directory_id: 'f1c658f5-0c5b-4c43-b4b2-5a0d97388c58',
//             directory_name: 'Folder 3',
//             parent_id: 'd3a34e23-9a6d-4b1c-bf26-60acdb84011f',
//             created_at: '2024-08-12T00:00:00Z',
//             children: [
//               {
//                 file_id: 'b548b439-70a4-4d69-85e7-1cf6b274e263',
//                 file_name: 'file3.js',
//                 directory_id: 'f1c658f5-0c5b-4c43-b4b2-5a0d97388c58',
//                 file_content: 'console.log("Hello Universe");',
//                 created_at: '2024-08-12T00:00:00Z',
//                 updated_at: '2024-08-12T00:00:00Z',
//                 parent_id: 'f1c658f5-0c5b-4c43-b4b2-5a0d97388c58',
//               },
//             ],
//           },
//         ],
//       },
//     ],
//     shared_with: [
//       {
//         user_id: '123e4567-e89b-12d3-a456-426614174000',
//         access_level: 'write',
//       },
//     ],
//   },
// ];

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

// async function clearCollections(db) {
//   await db.collection('users').deleteMany({});
//   await db.collection('projects').deleteMany({});
//   console.log('Cleared collections');
// }

// async function insertMockData(db) {
//   await db.collection('users').insertOne(mockUser);
//   await db.collection('projects').insertMany(mockProjects);
//   console.log('Inserted mock data');
// }

// Hocuspocus Server Configuration
const server = new Hocuspocus({
  port,
  extensions: [new Logger()],
  async onStoreDocument(context) {
    const projectId = context.document.name;
    console.log('OnStore -------->', projectId);

    await handleStoreDocument(context, projectId);
  },
  async onLoadDocument(context) {
    const projectId = context.document.name;
    console.log('OnLoad -------->', projectId);
    // I want to load only metadata stored for this project
    await handleLoadDocument(context, projectId);
    console.log(
      'Array loaded from house',
      Array.from(context.document.getMap('root')),
    );
    return context.document;
  },
  async afterLoadDocument(context) {
    console.log(
      'AfterLoad -------->',
      context.document.getMap('root').get('main-file').toJSON(),
    );
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
async function handleStoreDocument(context, projectId) {
  try {
    const yMap = context.document.getMap('root');
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
    });

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
    { upsert: true },
  );
  const project = await collection.findOne({
    project_id: projectId,
  });
  const file = project.children.find((child) => child.file_id === fileId);
  await client.close();
  return file;
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
    },
  );

  if (result.matchedCount === 0) {
    console.error(
      `No file found with fileId: ${fileId} in projectId: ${projectId}`,
    );
  } else {
    console.log(
      `File with fileId: ${fileId} updated successfully in projectId: ${projectId}`,
    );
  }

  await client.close();
}

async function loadfileFromDb(projectId, fileId, yText) {
  const project = await loadprojectFromDb(projectId);
  let file = project.children.find((child) => child.file_id === fileId);
  if (!file) {
    file = await insertFileToDb(projectId, fileId, yText);
    yText.applyDelta(yText.toDelta());
  } else {
    const content = file.file_content;
    if (content) {
      yText.applyDelta(content);
    } else {
      console.error(`File content is undefined for fileId: ${fileId}`);
    }
    return file;
  }
  // if (!project) {
  //   console.error(`Project not found: ${projectId}`);
  //   // create a new project
  //   await collection.insertOne({
  //     project_id: projectId,
  //     children: [],
  //   });
  //   // insert a new file
  //   await collection.updateOne(
  //     { projectId: projectId },
  //     {
  //       $push: {
  //         children: {
  //           file_id: fileId,
  //           project_id: projectId,
  //           file_content: yText.toDelta(),
  //         },
  //       },
  //     },
  //     { upsert: true }
  //   );
  //   yText.applyDelta(yText.toDelta());
  //   return;
  // } else {
  //   const file = project.children.find((child) => child.file_id === fileId);
<<<<<<< HEAD

  //   if (file) {
  //     const content = file.file_content;
  //     if (content) {
  //       yText.applyDelta(content);
  //     } else {
  //       console.error(`File content is undefined for fileId: ${fileId}`);
  //     }
  //   } else {
  //     console.error(`File not found: ${fileId}`);
  //   }
  // }
}

=======

  //   if (file) {
  //     const content = file.file_content;
  //     if (content) {
  //       yText.applyDelta(content);
  //     } else {
  //       console.error(`File content is undefined for fileId: ${fileId}`);
  //     }
  //   } else {
  //     console.error(`File not found: ${fileId}`);
  //   }
  // }
}


>>>>>>> 7574ae516935752b1452bf749a00a3547ce2f294
async function updateDocumentInDb(projectId, key, value, metaArray) {
  if (key === null) {
    console.error('Cannot store date');
    return;
  }
  // console.log('Updating document:', value.toJSON());
<<<<<<< HEAD
  const fileId = key;
=======
  const fileId = key
>>>>>>> 7574ae516935752b1452bf749a00a3547ce2f294
  const yText = value;
  console.log(`FileId: ${fileId}`);
  if (yText instanceof Y.Text) {
    const fileMeta = metaArray[`${key}_metadata`]; // Is metadata never stored in database a9lan!
    console.log('FileMeta:', fileMeta);
    if (fileMeta && fileMeta['new']) {
      // update the file from the database
      const file = await loadfileFromDb(projectId, fileId, yText);
      fileMeta['new'] = false;
    } else {
      // normal behavior
      await updateFileInDb(projectId, fileId, yText);
      console.log(`Document updated: ${projectId}/${fileId}`);
    }
<<<<<<< HEAD
=======


>>>>>>> 7574ae516935752b1452bf749a00a3547ce2f294
  }
}

async function handleLoadDocument(context, projectId) {
  try {
    const yMap = context.document.getMap('root');
    const projectMap = context.document.getMap('projectStructure');
    populateMap(projectMap, projectStructure);
    const project = await loadprojectFromDb(projectId);
    console.log('projectMap------>', projectMap);
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

// safely get a property from an object with a default value
function getSafe(obj, key, defaultValue) {
  return obj && obj[key] ? obj[key] : defaultValue;
}

// rec populate the Y.Map with directories and files
function populateMap(map, structure) {
  if (!structure || typeof structure !== 'object') {
    console.error('Invalid structure provided');
    return;
  }
  map.set('_id', getSafe(structure, '_id'));
  map.set('project_name', getSafe(structure, 'project_name'));
  map.set('environment_id', getSafe(structure, 'environment_id'));

  // main maps for directories and files
  const directoriesMap = new Y.Map();
  const filesMap = new Y.Map();

  // populate directories
  if (Array.isArray(structure.directories)) {
    structure.directories.forEach((directory) => {
      if (directory && typeof directory === 'object') {
        const dirMap = new Y.Map();
        dirMap.set('directory_name', getSafe(directory, 'directory_name'));
        dirMap.set('parent_id', getSafe(directory, 'parent_id'));
        dirMap.set(
          'files',
          populateFiles(new Y.Map(), getSafe(directory, 'files', [])),
        );
        dirMap.set(
          'children',
          populateDirectories(new Y.Map(), getSafe(directory, 'children', [])),
        );
        directoriesMap.set(getSafe(directory, '_id'), dirMap);
      } else {
        console.warn('Skipping invalid directory entry:', directory);
      }
    });
  } else {
    console.warn('Invalid directories format:', structure.directories);
  }

  // populate files
  if (Array.isArray(structure.files)) {
    structure.files.forEach((file) => {
      if (file && typeof file === 'object') {
        const fileMap = new Y.Map();
        fileMap.set('file_name', getSafe(file, 'file_name'));
        fileMap.set('parent_id', getSafe(file, 'parent_id'));
        filesMap.set(getSafe(file, '_id'), fileMap);
      } else {
        console.warn('Skipping invalid file entry:', file);
      }
    });
  } else {
    console.warn('Invalid files format:', structure.files);
  }

  // set directories and files in the main map
  map.set('directories', directoriesMap);
  map.set('files', filesMap);
}

function populateDirectories(map, directories) {
  if (!Array.isArray(directories)) {
    console.warn('Invalid directories array:', directories);
    return map;
  }

  directories.forEach((directory) => {
    if (directory && typeof directory === 'object') {
      const dirMap = new Y.Map();
      dirMap.set('directory_name', getSafe(directory, 'directory_name'));
      dirMap.set('parent_id', getSafe(directory, 'parent_id'));
      dirMap.set(
        'files',
        populateFiles(new Y.Map(), getSafe(directory, 'files', [])),
      );
      dirMap.set(
        'children',
        populateDirectories(new Y.Map(), getSafe(directory, 'children', [])),
      );
      map.set(getSafe(directory, '_id'), dirMap);
    } else {
      console.warn('Skipping invalid directory entry:', directory);
    }
  });

  return map;
}

function populateFiles(map, files) {
  if (!Array.isArray(files)) {
    console.warn('Invalid files array:', files);
    return map;
  }

  files.forEach((file) => {
    if (file && typeof file === 'object') {
      const fileMap = new Y.Map();
      fileMap.set('file_name', getSafe(file, 'file_name'));
      fileMap.set('parent_id', getSafe(file, 'parent_id'));
      map.set(getSafe(file, '_id'), fileMap);
    } else {
      console.warn('Skipping invalid file entry:', file);
    }
  });

  return map;
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
