import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HocuspocusService } from './hocuspocus.service';

@WebSocketGateway()
export class HocuspocusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly hocuspocusService: HocuspocusService) {
    this.hocuspocusService.setSocketIO(this.server);
  }

  async onModuleInit() {
    await this.hocuspocusService.start();
  }

  async onModuleDestroy() {
    await this.hocuspocusService.stop();
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }
}

