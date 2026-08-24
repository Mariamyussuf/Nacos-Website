import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { eq, and, sql } from 'drizzle-orm';
import { getDb } from '../database/db';
import { events, eventRegistrations } from '../database/schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

export interface RegisterAttendeeDto {
  fullName: string;
  matricNumber: string;
  email: string;
  phone?: string;
  department?: string;
  level?: string;
}

@Injectable()
export class EventsService {
  private get db() {
    return getDb();
  }

  async registerAttendee(eventId: string, dto: RegisterAttendeeDto) {
    const db = this.db;

    // Check if event exists
    const existingEvent = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    const eventTitle = existingEvent.length > 0 ? existingEvent[0].title : 'NACOS Chapter Event';

    // Check for duplicate matric registration for this event
    const duplicate = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.matricNumber, dto.matricNumber.trim().toUpperCase())
        )
      )
      .limit(1);

    if (duplicate.length > 0) {
      return {
        success: true,
        alreadyRegistered: true,
        ticketId: duplicate[0].id,
        message: `You are already registered for "${eventTitle}"!`,
        registration: duplicate[0],
      };
    }

    const id = `TKT-${uuid().slice(0, 8).toUpperCase()}`;

    const newReg = {
      id,
      eventId,
      eventTitle,
      fullName: dto.fullName.trim(),
      matricNumber: dto.matricNumber.trim().toUpperCase(),
      email: dto.email.trim(),
      phone: dto.phone ? dto.phone.trim() : null,
      department: dto.department || 'Computer Sciences',
      level: dto.level || '100 Level',
    };

    await db.insert(eventRegistrations).values(newReg);

    return {
      success: true,
      alreadyRegistered: false,
      ticketId: id,
      message: `Registration confirmed for "${eventTitle}"! See you there.`,
      registration: newReg,
    };
  }

  async getRegistrationsForEvent(eventId: string) {
    const db = this.db;
    return db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId))
      .orderBy(sql`${eventRegistrations.createdAt} DESC`);
  }

  async getAllRegistrations() {
    const db = this.db;
    return db
      .select()
      .from(eventRegistrations)
      .orderBy(sql`${eventRegistrations.createdAt} DESC`);
  }

  async findAll(query: { status?: string; category?: string }) {

    const db = this.db;
    const conditions: any[] = [];

    if (query.status) {
      conditions.push(eq(events.status, query.status));
    }
    if (query.category) {
      conditions.push(eq(events.category, query.category));
    }

    let results;
    if (conditions.length > 0) {
      results = await db
        .select()
        .from(events)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(sql`${events.createdAt} DESC`);
    } else {
      results = await db
        .select()
        .from(events)
        .orderBy(sql`${events.createdAt} DESC`);
    }

    return results.map((event) => ({
      ...event,
      gallery: event.gallery ? JSON.parse(event.gallery) : [],
    }));
  }

  async findById(id: string) {
    const db = this.db;
    const results = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (results.length === 0) {
      throw new NotFoundException(`Event with id "${id}" not found`);
    }

    const event = results[0];
    return {
      ...event,
      gallery: event.gallery ? JSON.parse(event.gallery) : [],
    };
  }

  async create(dto: CreateEventDto) {
    const db = this.db;
    const id = uuid();

    await db.insert(events).values({
      id,
      title: dto.title,
      date: dto.date,
      venue: dto.venue,
      description: dto.description,
      category: dto.category || 'Seminar',
      status: dto.status || 'upcoming',
      flier: dto.flier,
      commentary: dto.commentary,
      gallery: dto.gallery ? JSON.stringify(dto.gallery) : null,
    });

    return this.findById(id);
  }

  async update(id: string, dto: UpdateEventDto) {
    const db = this.db;

    // Check exists
    const existing = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Event with id "${id}" not found`);
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.date !== undefined) updateData.date = dto.date;
    if (dto.venue !== undefined) updateData.venue = dto.venue;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.flier !== undefined) updateData.flier = dto.flier;
    if (dto.commentary !== undefined) updateData.commentary = dto.commentary;
    if (dto.gallery !== undefined)
      updateData.gallery = JSON.stringify(dto.gallery);

    await db.update(events).set(updateData).where(eq(events.id, id));

    return this.findById(id);
  }

  async delete(id: string) {
    const db = this.db;

    const existing = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Event with id "${id}" not found`);
    }

    await db.delete(events).where(eq(events.id, id));
    return { message: 'Event deleted successfully' };
  }
}
