import { Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import Delta from 'quill-delta';
import * as Y from 'yjs';

const port = 1234;
// This is an example of fully loaded data from the db, but file_content is going to be delta
// In our case every file content will actually be stored as delta that will be applied to the yobject
// once the y.text is created 
const project = {
    projectId: '4653',
    children: [ 
        { type: 'file', file_name: 'test.js', project_id: '4653', file_content: 'it is me hi, I am the problem it is me' },
        {
            type: 'dir', directory_name: 'testdir', project_id: '4653', 
            children: [
                { type: 'file', file_name: 'test2.js', project_id: '4653', file_content: 'taylor swift' },
                { type: 'file', file_name: 'test3.js', project_id: '4653', file_content: 'lavendar haze' },
            ]
        }
    ]
}

const textToDelta = (text) => new Delta().insert(text);

// Hocuspocus Server Configuration
const server = new Hocuspocus({
    port,
    extensions: [new Logger()],
    async onLoadDocument(context) {
      const projectId = context.document.name;
      console.log('OnLoad -------->', projectId);
    //   await handleLoadDocument(context, projectId);
      const ymap = context.document.getMap('root');
      ymap.set('filetree', project);
      console.log('Array loaded from house', Array.from(context.document.getMap('root')));
      return context.document
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


async function handleLoadDocument(context) {
    const yMap = context.document.getMap('root');
    loadProjectToYMap(yMap, project);
  }
  
  function loadProjectToYMap(yMap, project) {
    for (const file of project.children) {
      if (file.type === 'file') {
        const { file_id: fileId, file_content: content } = file;
        if (content) {
          const yText = new Y.Text();
          const delta = textToDelta(content);
          yText.applyDelta(delta);
          console.log('YText:', yText.toJSON());
          yMap.set(fileId, yText);
        } else {
          console.error(`File content is undefined for fileId: ${fileId}`);
        }
      } else if (file.type === 'dir') {
        const ymap = new Y.Map();
        yMap.set(file.dir_id, ymap);
        loadProjectToYMap(ymap, file); // Recursively handle subdirectories
      }
    }
  }

  // saving ymap to db
  async function saveYMapToDb(yMap, projectId, parentDirId = null) {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection('projects');
  
    for (const [key, value] of yMap.entries()) {
      if (value instanceof Y.Text) {
        // Handle files
        const fileContent = value.toDelta();
        const fileRecord = {
          type: 'file',
          file_id: key,
          project_id: projectId,
          file_content: fileContent,
          parent_dir_id: parentDirId
        };
        await collection.updateOne(
          { project_id: projectId, 'children.file_id': key },
          { $set: { 'children.$': fileRecord } },
          { upsert: true }
        );
      } else if (value instanceof Y.Map) {
        // Handle directories
        const dirId = key;
        const dirRecord = {
          type: 'dir',
          dir_id: dirId,
          project_id: projectId,
          parent_dir_id: parentDirId,
          children: []
        };
        await collection.updateOne(
          { project_id: projectId, 'children.dir_id': dirId },
          { $set: { 'children.$': dirRecord } },
          { upsert: true }
        );
  
        // Recursively save the directory's contents
        await saveYMapToDb(value, projectId, dirId);
      }
    }
  
    await client.close();
  }
  

// Connection Handlers
function handleConnect(context) {
    if (context) {
      const connectionId = context.connection?.id || 'unknown';
      const roomName = context.document?.name || 'unknown';
  
      console.log(`Client connected: ${connectionId}`);
      console.log(`Room name: ${roomName}`);
    } else {
      console.error('Awareness context is undefined');
    }
  }
  
  function handleDisconnect(context) {
    const connectionId = context.connection?.id || 'unknown';
    console.log(`Client disconnected: ${connectionId}`);
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