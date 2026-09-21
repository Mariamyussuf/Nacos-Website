import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ContactService } from './contact.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CaptchaService } from '../captcha/captcha.service';


class CreateMessageDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(150, { message: 'Email cannot exceed 150 characters' })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'Subject cannot exceed 150 characters' })
  subject?: string;

  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  @MaxLength(3000, { message: 'Message cannot exceed 3,000 characters' })
  message: string;

  @IsOptional()
  @IsString()
  captchaToken?: string;

  @IsOptional()
  @IsString()
  captchaAnswer?: string;
}

class UpdateStatusDto {
  @IsOptional()
  @IsString()
  status?: 'read' | 'unread';
}

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Post()
  create(@Body() dto: CreateMessageDto, @Req() req: any) {
    const captchaToken =
      (req.headers['x-captcha-token'] as string) || dto.captchaToken;
    const captchaAnswer =
      (req.headers['x-captcha-answer'] as string) || dto.captchaAnswer;

    if (captchaToken || process.env.REQUIRE_CAPTCHA === 'true') {
      this.captchaService.verify(captchaToken, captchaAnswer);
    }

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
