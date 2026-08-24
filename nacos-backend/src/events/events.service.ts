import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { eq, and, sql } from 'drizzle-orm';
import { getDb } from '../database/db';
import { events } from '../database/schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private get db() {
    return getDb();
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
