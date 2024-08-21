import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { HoxPoxAdapter } from './ws-adapter';

@Module({
  providers: [EventsGateway, HoxPoxAdapter],
})
export class EventsModule {}
