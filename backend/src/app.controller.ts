import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@auth/decorators/isPublic.decorator';

@ApiTags('AppController')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Get Hello Message',
    description: 'Returns a simple greeting message.',
  })
  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
