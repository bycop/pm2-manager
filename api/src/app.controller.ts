import { Controller, Get, Param, Req, Res, Next, MiddlewareConsumer } from '@nestjs/common';
import { AppService, Response } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Add middleware to check if request comes from localhost
  private checkLocalhost(req, res, next) {
    const isLocalhost = req.connection.remoteAddress === '127.0.0.1';
    if (!isLocalhost) {
      return res.status(403).send('Forbidden');
    }
    next();
  }

  // Apply middleware to all routes
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.checkLocalhost)
      .forRoutes('*');
  }

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