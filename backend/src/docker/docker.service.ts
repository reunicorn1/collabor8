import { Injectable, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import * as Docker from 'dockerode';

@Injectable()
export class DockerService {
  private readonly logger = new Logger(DockerService.name);
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

  async executeLanguageCode(code: string, language?: string, filename?:string): Promise<string> {
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
    return logs;
  }



//   async executePythonCode(code: string): Promise<string> {
//     try {
//       const container = await this.docker.createContainer({
//         Image: 'python-leetcode',
//         Cmd: ['python3', '-c', code],
//         Tty: false, // Disable pseudo-TTY
//         AttachStdout: true,
//         AttachStderr: true,
//       });

//       await container.start();
//       const containerInfo = await container.inspect();
//       console.log(containerInfo.State);

//       const waitResult = await container.wait();
//       const exitCode = waitResult.StatusCode;

//       if (exitCode !== 0) {
//         throw new Error(`Container exited with non-zero status code ${exitCode}`);
//       }

//       const logsStream = await container.logs({
//         stdout: true,
//         stderr: true,
//         follow: true,
//       });      // Wait for the container to finish

//       let logs = '';
//       logsStream.on('data', (chunk) => {
//         logs += chunk.toString();
//       });

//       // Ensure all logs are collected
//       await new Promise((resolve) => logsStream.on('end', resolve));

//       // Remove the container
//       await container.remove();

//       return logs;
//     } catch (error) {
//       this.logger.error('Error executing code in Docker container', error.stack);
//       throw new InternalServerErrorException('Error executing code in Docker container');
//     }
//   }
}

