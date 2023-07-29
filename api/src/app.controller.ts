import { Controller, Get, Param } from '@nestjs/common';
import { AppService, Response } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Route to get all pm2 processes
  @Get('pm2/processes')
  async getPm2Processes(): Promise<Response> {
    return await this.appService.getPm2Processes();
  }

  // Route to stop a process by id
  @Get('pm2/stop/:id')
  async stopPm2Process(@Param('id') id: number): Promise<Response> {
    return await this.appService.stopPm2Process(id);
  }

  // Route to start a process by id
  @Get('pm2/start/:id')
  async startPm2Process(@Param('id') id: number): Promise<Response> {
    return await this.appService.startPm2Process(id);
  }

  // Route to restart a process by id
  @Get('pm2/restart/:id')
  async restartPm2Process(@Param('id') id: number): Promise<Response> {
    return await this.appService.restartPm2Process(id);
  }

  // Route to restart a process by id
  @Get('pm2/logs/:id')
  async logsPm2Process(@Param('id') id: number): Promise<Response> {
    return await this.appService.logsPm2Process(id);
  }
}
