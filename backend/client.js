/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable jest/require-hook */
const WebSocket = require('ws');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');

// Initialize Yjs document as every client keeps a local version
const ydoc = new Y.Doc();

// Create a WebSocket client: When connection happens, using project name ther server idenrifies or
// creates a Y.Doc for this rooom in the server side and synchronnizes changes.
const wsProvider = new WebsocketProvider('ws://0.0.0.0:1234', 'project-room', ydoc);

// A text file is created for this room if a shared text type of key 'codemirror' exists we will
// simply retrieve it or create a new one if it doesn't exist
// Observe changes to the Yjs document
const yText = ydoc.getText('codemirror');
yText.observe((event) => {
  console.log('Document updated:', yText.toString());
});

// Simulate client actions
wsProvider.on('status', (event) => {
  if (event.status === 'connected') {
    console.log('Connected to WebSocket server');

    ydoc.transact(() => {
      yText.insert(0, 'Hello from the Node.js client!\n');
    });

    console.log('Current document content:', yText.toString());
  }
});

// Handle WebSocket errors
wsProvider.on('connection-close', () => {
  console.log('Connection closed');
});

wsProvider.on('connection-error', (error) => {
  console.error('Connection error:', error);
});
