import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('debug')
export class DebugEnvController {
  constructor(private readonly configService: ConfigService) {}

  @Get('env-check')
  @HttpCode(HttpStatus.OK)
  checkEnvironment() {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    
    return {
      environment: nodeEnv,
      jwtSecretSet: !!jwtSecret,
      jwtSecretLength: jwtSecret ? jwtSecret.length : 0,
      jwtSecretStart: jwtSecret ? jwtSecret.substring(0, 10) + '...' : 'NOT_SET',
      jwtExpiresIn: jwtExpiresIn || 'NOT_SET',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }
}
