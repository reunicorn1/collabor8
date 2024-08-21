import {
  WebSocketAdapter,
  INestApplicationContext,
  OnModuleDestroy,
} from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
import options from './options';
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
//import * as Y from 'yjs';

export class HoxPoxAdapter implements WebSocketAdapter, OnModuleDestroy {
  private server: WebSocketServer;
  private hocuspocusServer: Hocuspocus;

  create(port: number, options?: any): WebSocketServer {
    this.server = new WebSocketServer({ port });
    try {
      this.hocuspocusServer = new Hocuspocus({
        ...options,
        port,
        extensions: [new Logger()],
      });
    } catch (error) {
      console.log('Error initializing Hocuspocus:', error);
    }
    return this.server;
  }

  bindClientConnect(
    server: WebSocketServer,
    callback: (client: WebSocket) => void,
  ) {
    console.log('-------onConnect-------->');
    console.log({ server });
    server.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      this.hocuspocusServer.handleConnection(ws, request);
      callback(ws);
    });
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) => this.bindMessageHandler(data, handlers, process)),
        filter((result) => result !== undefined),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    buffer: any,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    try {
      // console.log('----OnMessage------->', {
      //   data: Buffer.from(buffer.data, 'utf8').toString('utf8'),
      // });
      // //const message = JSON.parse(buffer.data.toString('utf8'));
      const message = JSON.parse(Buffer.from(buffer.data).toString('utf8'));
      const messageHandler = handlers.find(
        (handler) => handler.message === message.event,
      );
      if (!messageHandler) {
        return EMPTY;
      }
      return process(messageHandler.callback(message.data));
    } catch (error) {
      console.error('Error processing message:', error);
      return EMPTY;
    }
  }

  close(server) {
    console.log('--------OnClose------->');
    server.close();
  }
  onModuleDestroy() {
    if (this.hocuspocusServer) {
      this.hocuspocusServer.destroy();
    }
  }
}
