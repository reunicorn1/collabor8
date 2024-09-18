import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as Docker from 'dockerode';
import { PassThrough } from 'stream';

@Injectable()
export class DockerService {
  private docker: Docker;

  constructor() {
    this.docker = new Docker();
  }


  async runDockerContainer(image: string, command: string[]): Promise<{ stdout: string, stderr: string }> {
    return new Promise((resolve, reject) => {
      // Create streams to capture stdout and stderr separately
      const stdoutStream = new PassThrough();
      const stderrStream = new PassThrough();


      let logs = { stdout: '', stderr: '' };
      this.docker.run(image, command, [stdoutStream, stderrStream], { Tty: false })
        .then(() => {

          stdoutStream.on('data', (data) => {
            logs.stdout += data.toString();
          });

          stderrStream.on('data', (data) => {
            logs.stderr += data.toString();
          });

          stdoutStream.on('error', (error) => {
            reject(`Error reading stdout stream: ${error.message}`);
          });

          stderrStream.on('error', (error) => {
            reject(`Error reading stderr stream: ${error.message}`);
          });
          stdoutStream.on('end', () => {
            stderrStream.on('end', () => {
              resolve({
                stdout: logs.stdout,
                stderr: logs.stderr
              });
            });
          });
        })
        .catch((err) => {
          reject(`Error running container: ${err.message}`);
        })
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

  async executeLanguageCode(code: string, filename?: string, language?: string): Promise<{ stdout: string, stderr: string }> {
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
    const logs = await this.runDockerContainer(image, command);
    return logs;
  }
}

