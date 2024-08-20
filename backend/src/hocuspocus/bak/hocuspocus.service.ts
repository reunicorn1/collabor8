import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Hocuspocus } from '@hocuspocus/server'; // Adjust import based on actual package
import { Logger } from '@hocuspocus/extension-logger';

@Injectable()
export class HocuspocusService implements OnModuleInit, OnModuleDestroy {
  private server: any; // Use 'any' if you are unsure about the type
  private mongoUrl = 'mongodb://localhost:27017'; // Update this with your MongoDB URL
  private dbName = 'collabor8'; // Update this with your database name

  constructor() {
    this.initializeServer();
  }

  private initializeServer() {
    this.server = new Hocuspocus({
      port: 1234, // specify your desired port
      extensions: [
        new Logger(), // Optional: add logging for debugging
      ],
      // onStoreDocument: async (context) => {
      //   const projectId = context.document.name;
      //   console.log('OnStore -------->', projectId);
      //   const yMap = context.document.getMap('root');
      //   await this.handleStoreDocument(yMap, projectId);
      // },
      // onLoadDocument: async (context) => {
      //   const projectId = context.document.name;
      //   console.log('OnLoad -------->', projectId);
      //   await this.handleLoadDocument(context, projectId);
      //   console.log('Array loaded from house', Array.from(context.document.getMap('root')));
      //   return context.document;
      // },
      // afterLoadDocument: async (context) => {
      //   console.log('AfterLoad -------->', Array.from(context.document.getMap('root')));
      // },
      onConnect: async (context) => {
        await this.handleConnect(context);
      },
      onDisconnect: async (context) => {
        await this.handleDisconnect(context);
      },
      // onUpdate: async (context) => {
      //   console.log(`Document updated in room: ${context.document.name}`);
      // },
    });
  }

  async onModuleInit() {
    try {
      await this.server.listen();
      console.log(`Hocuspocus server is running on port 1234`);
    } catch (error) {
      console.error('Failed to start the Hocuspocus server:', error);
    }
  }

  async onModuleDestroy() {
    try {
      // Add logic to gracefully shut down the server if needed
      console.log('Hocuspocus server is shutting down');
      // No `close()` method; you might need to handle server shutdown differently
    } catch (error) {
      console.error('Failed to stop the Hocuspocus server:', error);
    }
  }

  // Define your handler methods here
  private async handleStoreDocument(yMap: any, projectId: string) {
    // Your implementation here
  }

  private async handleLoadDocument(context: any, projectId: string) {
    // Your implementation here
  }

  private async handleConnect(context: any) {
    // Your implementation here
    console.log('Client connected:', context.clientId);
  }

  private async handleDisconnect(context: any) {
    // Your implementation here
    console.log('Client disconnected:', context.clientId);
  }
}

