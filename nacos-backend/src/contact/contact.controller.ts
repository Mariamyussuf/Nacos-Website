import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ContactService } from './contact.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

class CreateMessageDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsString()
  message: string;
}

class UpdateStatusDto {
  @IsOptional()
  @IsString()
  status?: 'read' | 'unread';
}

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(@Body() dto: CreateMessageDto) {
    return this.contactService.create(dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id/read')
  markRead(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.contactService.markAsRead(id, dto.status || 'read');
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}
