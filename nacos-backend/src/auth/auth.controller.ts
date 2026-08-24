import {
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: any) {
    return {
      message: 'Login successful',
      user: req.user,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: any) {
    req.logout((err: any) => {
      if (err) throw err;
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getMe(@Request() req: any) {
    return req.user;
  }
}
