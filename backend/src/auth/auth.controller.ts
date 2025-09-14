import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<{ accessToken: string; user: any }> {
    return this.authService.login(body.email, body.password);
  }

  @Post('signup')
  async signup(
    @Body() body: { email: string; password: string; name: string },
  ): Promise<{ accessToken: string; user: any }> {
    return this.authService.signup(body.email, body.password, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any): any {
    return req.user;
  }
}
