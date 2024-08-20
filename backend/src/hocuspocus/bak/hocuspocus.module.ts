import { Module } from '@nestjs/common';
import { HocuspocusService } from './hocuspocus.service';

@Module({
  providers: [HocuspocusService],
  exports: [HocuspocusService],
})
export class HocuspocusModule {}
