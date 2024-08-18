import { Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import { MongoClient } from 'mongodb';
import * as Y from 'yjs';

// Constants
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'collabor8';
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

    await loadprojectFromDb(projectId);
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
async function handleStoreDocument(context, projectId) {
  try {
    const yMap = context.document.getMap('root');
    const metaArray = {};
    Array.from(yMap.entries()).map(([key, value]) => {
      if (key.endsWith('_metadata')) {
        metaArray[key] = value;
      }
    });
    // console.log('MetaArray:', metaArray);
    const yTextArray = Array.from(yMap.entries()).map(([key, value]) => {
      if (!key.endsWith('_metadata')) {
        return { key, value };
      }
    }
    );
    // console.log('MetaArray:', metaArray);

    console.log(Array.from(yTextArray.length));
    for (const [key, value] of Array.from(yMap.entries())) {
      // metdata is undefined!!
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


async function updateDocumentInDb(projectId, key, value, metaArray) {
  if (key === null) {
    console.error('Cannot store date');
    return;
  }
  // console.log('Updating document:', value.toJSON());
  const fileId = key
  const yText = value;
  console.log(`FileId: ${fileId}`);
  if (yText instanceof Y.Text) {
    const fileMeta = metaArray[`${key}_metadata`];
    console.log('FileMeta:', fileMeta);
    if (fileMeta['new']) {
      // update the file from the database
      const file = await loadfileFromDb(projectId, fileId, yText);
      fileMeta['new'] = false;
    } else {
      // normal behavior
      await updateFileInDb(projectId, fileId, yText);

      console.log(`Document updated: ${projectId}/${fileId}`);
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

// Periodic Document Update
// setInterval(async () => {
//   try {
//     const client = await MongoClient.connect(mongoUrl);
//     const db = client.db(dbName);
//     const collection = db.collection(collectionName);
//     const documents = await collection.find().toArray();
//     for (const doc of documents) {
//       if (doc.content) {
//         await updateDocumentContent(collection, doc);
//       }
//     }
//   } catch (error) {
//     console.error('Error during periodic document update:', error);
//   }
// // }, 10000);

// async function updateDocumentContent(collection, doc) {
//   try {
//     const ydoc = new Y.Doc();
//     Y.applyUpdate(ydoc, new Uint8Array(doc.content.buffer));
//     const documentName = doc.name;
//     await collection.updateOne(
//       { name: documentName },
//       { $set: { content: Buffer.from(Y.encodeStateAsUpdate(ydoc)) } },
//       { upsert: true },
//     );
//     console.log(`Document updated: ${documentName}`);
//   } catch (error) {
//     console.error(`Failed to update document ${doc.name}:`, error);
//   }
// }

// Initialize database
initializeDatabase();
