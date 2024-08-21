import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';

@Injectable()
export class HocuspocusService {
  private hocuspocusServer: any;
  private io: Server;
  private port = 1234;

  constructor() {
    this.initializeHocuspocus();
  }

  private initializeHocuspocus() {
    this.hocuspocusServer = new Hocuspocus({
      port: this.port,
      extensions: [new Logger()],
      onStoreDocument: async (context) => {
        console.log('OnStore -------->', context.document.name);
        // Handle document storage here
      },
      onLoadDocument: async (context) => {
        console.log('OnLoad -------->', context.document.name);
        // Handle document loading here
      },
      afterLoadDocument: async (context) => {
        console.log('AfterLoad -------->', Array.from(context.document.getMap('root')));
      },
      onConnect: async (context) => {
        // console.log('Client connected:', context.document.name);
        console.log('Client connected');
        // Handle client connection here
      },
      onDisconnect: async (context) => {
        console.log('Client disconnected:', context.document.name);
        // Handle client disconnection here
      },
      // onUpdate: async (context) => {
      //   console.log(`Document updated in room: ${context.document.name}`);
      // },
      onChange: async (context) => {
        console.log(`Document changed in room: ${context.document.name}`);
      }
    });
  }

  async start() {
    // Start Hocuspocus server here
    await this.hocuspocusServer.listen();
    console.log(`Hocuspocus server is running on port ${this.port}`);
  }

  async stop() {
    // Stop Hocuspocus server here
    console.log('Hocuspocus server is shutting down');
    // Implement server shutdown logic
  }

  setSocketIO(server: Server) {
    this.io = server;
  }
}

