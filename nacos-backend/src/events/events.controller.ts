import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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
    @Body()
    dto: {
      fullName: string;
      matricNumber: string;
      email: string;
      phone?: string;
      department?: string;
      level?: string;
    },
  ) {
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
