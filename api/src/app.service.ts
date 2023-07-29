import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

export interface Pm2Process {
  name: string;
  id: string;
  state: "stopped" | "online";
}

export interface Response {
  data: Pm2Process[] | Pm2Process | string;
  error?: boolean;
}

function getPm2Processes(): Promise<Response> {
  return new Promise((resolve) => {
    const processes: Pm2Process[] = [];
    exec('pm2 jlist', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        resolve({
          error: true,
          data: error.message,
        });
        return;
      }

      if (stderr) {
        console.log(`stderr: ${stderr}`);
        resolve({
          error: true,
          data: stderr,
        });
        return;
      }

      const json = JSON.parse(stdout);
      json.forEach((process) => {
        processes.push({
          name: process.name,
          id: process.pm_id,
          state: process.pm2_env.status,
        });
      });

      resolve({
        data: processes,
      });
    });
  });
}


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getPm2Processes(): Promise<Response> {
    const processes = await getPm2Processes();
    return processes;
  }

  async stopPm2Process(id: number): Promise<Response> {
    return new Promise((resolve, reject) => {
      exec(`pm2 stop ${id}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          resolve({
            error: true,
            data: error.message,
          });
          return;
        }
  
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          resolve({
            error: true,
            data: stderr,
          });
          return;
        }

        resolve({
          data: `You stopped process ${id}`,
        });
      });
    });
  }

  async startPm2Process(id: number): Promise<Response> {
    return new Promise((resolve, reject) => {
      exec(`pm2 start ${id}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          resolve({
            error: true,
            data: error.message,
          });
          return;
        }
  
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          resolve({
            error: true,
            data: stderr,
          });
          return;
        }

        resolve({
          data: `You started process ${id}`,
        });
      });
    });
  }

  async restartPm2Process(id: number): Promise<Response> {
    return new Promise((resolve, reject) => {
      exec(`pm2 restart ${id}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          resolve({
            error: true,
            data: error.message,
          });
          return;
        }
  
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          resolve({
            error: true,
            data: stderr,
          });
          return;
        }

        resolve({
          data: `You restarted process ${id}`,
        });
      });
    });
  }

  async logsPm2Process(id: number): Promise<Response> {
    // Get last 50 lines of logs
    return new Promise((resolve, reject) => {
      exec(`pm2 logs ${id} --lines 50 --nostream`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          resolve({
            error: true,
            data: error.message,
          });
          return;
        }
  
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          resolve({
            error: true,
            data: stderr,
          });
          return;
        }

        resolve({
          data: stdout.slice(-4000),
        });
      });
    });
  }
}
