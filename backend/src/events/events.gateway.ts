import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
import options from './options';
import { HoxPoxAdapter } from './ws-adapter';

@WebSocketGateway(8080, options)
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    console.log({client, data})
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
