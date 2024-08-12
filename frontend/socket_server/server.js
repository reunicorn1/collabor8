import { Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import { MongoClient } from 'mongodb';
import * as Y from 'yjs';

let connectionCount = 0;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'collabor8';
const collectionName = 'documents';
let db, collection;

// Connect to MongoDB
MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

const server = new Hocuspocus({
  port: 9090,
  extensions: [new Logger()],
  async onStoreDocument(context) {
    const documentName = context.document.name;
    try {
      const documentContent = Buffer.from(
        Y.encodeStateAsUpdate(context.document),
      );
      await collection.updateOne(
        { name: documentName },
        { $set: { content: documentContent } },
        { upsert: true },
      );
      console.log(`Document stored: ${documentName}`);
    } catch (error) {
      console.error(`Failed to store document ${documentName}:`, error);
    }
  },
  async onLoadDocument(context) {
    const documentName = context.document.name;
    try {
      const doc = await collection.findOne({ name: documentName });
      const ydoc = new Y.Doc();
      if (doc && doc.content) {
        Y.applyUpdate(ydoc, new Uint8Array(doc.content.buffer));
      }
      return ydoc;
    } catch (error) {
      console.error(`Failed to load document ${documentName}:`, error);
      return new Y.Doc();
    }
  },
  onConnect: (context) => {
    // Check if context.awareness is properly initialized
    console.log('Awareness Context:', context.awareness);
    if (context.awareness) {
      const connectionId = context.connection?.id || 'unknown';
      const roomName = context.document?.name || 'unknown';
      const username =
        context.awareness.getLocalState()?.user?.name || 'unknown';

      const awarenessState = context.awareness.getStates();
      console.log('Full Awareness State:', awarenessState);

      connectionCount++;
      console.log(`Client connected: ${connectionId}`);
      console.log(`Room name: ${roomName}`);
      console.log(`Username: ${username}`);
      console.log(`Number of connected clients: ${connectionCount}`);
    } else {
      console.error('Awareness context is undefined');
    }
  },
  onDisconnect: (context) => {
    const connectionId = context.connection?.id || 'unknown';
    connectionCount--;
    console.log(`Client disconnected: ${connectionId}`);
    console.log(`Number of connected clients: ${connectionCount}`);
  },
  onError: (context, error) => {
    console.error(`Error occurred: ${error.message}`);
  },
  onUpdate: (context) => {
    console.log(`Document updated in room: ${context.document.name}`);
  },
});

server
  .listen()
  .then(() => {
    console.log('Hocuspocus server is running on port 9090');
  })
  .catch((error) => {
    console.error('Failed to start the server:', error);
  });

// Set interval to update the saved document every 10 seconds
setInterval(async () => {
  try {
    const documents = await collection.find().toArray();
    for (const doc of documents) {
      if (doc.content) {
        const ydoc = new Y.Doc();
        Y.applyUpdate(ydoc, new Uint8Array(doc.content.buffer));
        const documentName = doc.name;
        await collection.updateOne(
          { name: documentName },
          { $set: { content: Buffer.from(Y.encodeStateAsUpdate(ydoc)) } },
          { upsert: true },
        );
        console.log(`Document updated: ${documentName}`);
      }
    }
  } catch (error) {
    console.error('Error during periodic document update:', error);
  }
}, 10000);
