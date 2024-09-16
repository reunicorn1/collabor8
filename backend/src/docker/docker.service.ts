import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as Docker from 'dockerode';

@Injectable()
export class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }

  async createStartContainer(image: string, command: string[]): Promise<Docker.Container> {
  const container = await this.docker.createContainer({
      Image: image,
      Cmd: command,
      Tty: true,
      AttachStdout: true,
      AttachStderr: true,
    });
    await container.start();
    return container;
  }

  async removeContainer(container: Docker.Container): Promise<void> {
    await container.remove();
  }

  async getContainerLogs(container: Docker.Container): Promise<string> {
    return new Promise((resolve, reject) => {
      container.logs({ follow: true, stdout: true, stderr: true }, (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        let logs = '';
        stream.on('data', (chunk) => {
          logs += chunk.toString();
        });
        stream.on('end', () => {
          resolve(logs);
        });
      });
    });
  }

  async getLanguage(filename: string): Promise<string> {
    const extension = filename.split('.').pop();
    switch (extension) {
      case 'py':
        return 'python';
      case 'js':
        return 'javascript';
      default:
        throw new BadRequestException(`Unsupported file extension ${extension}`);
    }
  }

  async executeLanguageCode(code: string, filename?:string, language?: string): Promise<string> {
    let image: string;
    let command: string[];
    if (!language && !filename) {
      throw new BadRequestException('Either language or filename must be provided');
    }
    if (filename) {
      language = await this.getLanguage(filename);
    }
    switch (language) {
      case 'python':
        image = 'python-leetcode';
        command = ['python3', '-c', code];
        break;
      case 'javascript':
        image = 'node-leetcode';
        command = ['node', '-e', code];
        break;
      default:
        throw new Error(`Unsupported language ${language}`);
    }
    const container = await this.createStartContainer(image, command);
    const logs = await this.getContainerLogs(container);
    await this.removeContainer(container);
    Logger.log(logs);
    return logs;
  }
}

