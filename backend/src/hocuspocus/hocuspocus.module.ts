import { Module } from '@nestjs/common';
import { HocuspocusService } from './hocuspocus/hocuspocus.service';
import { HocuspocusGateway } from './hocuspocus/hocuspocus.gateway';

@Module({
  providers: [HocuspocusService, HocuspocusGateway]
})
export class HocuspocusModule {}
