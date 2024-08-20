import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HoxPoxAdapter } from './ws-adapter';
import options from './options';


@WebSocketGateway(1234, {
  adapter: HoxPoxAdapter,
  ...options,
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('status')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }
}
