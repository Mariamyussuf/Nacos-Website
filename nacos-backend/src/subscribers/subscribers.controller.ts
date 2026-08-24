import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';
import { IsEmail } from 'class-validator';
import { SubscribersService } from './subscribers.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

class SubscribeDto {
  @IsEmail()
  email: string;
}

@Controller()
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post('subscribe')
  subscribe(@Body() dto: SubscribeDto) {
    return this.subscribersService.subscribe(dto.email);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('subscribers')
  findAll() {
    return this.subscribersService.findAll();
  }
}
