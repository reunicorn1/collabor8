import { WebSocketAdapter, INestApplicationContext } from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { Configuration, Hocuspocus } from '@hocuspocus/server';
import { Logger } from '@hocuspocus/extension-logger';
//import * as Y from 'yjs';
export class HoxPoxAdapter implements WebSocketAdapter {
  private hocuspocusServer: Hocuspocus;

  constructor(private app: INestApplicationContext) { }

  create(port: number, options: any = {}): any {
    const server = new Hocuspocus({
      port,
      extensions: [new Logger()],
      ...options,
    });

    server.listen(port);
    return server;
  }

  bindClientConnect(server: any, callback: any) {
    return server.configuration.onConnect((arg) => {
      console.log('onConnect------------->', { arg });
      callback(arg);
    })
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) => this.bindMessageHandler(data, handlers, process)),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    buffer,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    console.log('----OnMessage------->', { buffer });
    const message = JSON.parse(buffer.data);
    const messageHandler = handlers.find(
      (handler) => handler.message === message.event,
    );
    if (!messageHandler) {
      return EMPTY;
    }
    return process(messageHandler.callback(message.data));
  }

  close(server) {
    server.destory();
  }
}
