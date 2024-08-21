import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { HoxPoxAdapter } from './ws-adapter';
import { options } from './options';

@WebSocketGateway(1234, {
  adapter: HoxPoxAdapter,
  ...options,
})
export class EventsGateway {}
