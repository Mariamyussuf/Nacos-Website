import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CaptchaService } from '../captcha/captcha.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.eventsService.findAll({ status, category });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post(':id/register')
  register(
    @Param('id') id: string,
    @Body() dto: RegisterAttendeeDto,
    @Req() req: any,
  ) {
    const captchaToken =
      (req.headers['x-captcha-token'] as string) || dto.captchaToken;
    const captchaAnswer =
      (req.headers['x-captcha-answer'] as string) || dto.captchaAnswer;

    if (captchaToken || process.env.REQUIRE_CAPTCHA === 'true') {
      this.captchaService.verify(captchaToken, captchaAnswer);
    }

    return this.eventsService.registerAttendee(id, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(':id/registrations')
  getRegistrations(@Param('id') id: string) {
    return this.eventsService.getRegistrationsForEvent(id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('admin/registrations')
  getAllRegistrations() {
    return this.eventsService.getAllRegistrations();
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
  }


  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
