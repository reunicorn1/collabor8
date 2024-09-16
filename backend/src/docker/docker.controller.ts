import { Request, Controller, Post } from '@nestjs/common';
import { DockerService } from './docker.service';
import { Public } from '@auth/decorators/isPublic.decorator';

@Controller('docker')
export class DockerController {
  constructor(private readonly dockerService: DockerService) {}

  @Public()
  @Post('execute')
  async executeCode(@Request() req): Promise<string> {
    return this.dockerService.executeLanguageCode(req.body.code, req.body?.language, req.body?.filename);
  }
}

