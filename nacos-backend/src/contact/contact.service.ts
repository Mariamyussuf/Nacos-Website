import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { getDb } from '../database/db';
import { contactMessages } from '../database/schema';

export interface CreateContactMessageDto {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

@Injectable()
export class ContactService {
  private get db() {
    return getDb();
  }

  async create(dto: CreateContactMessageDto) {
    const db = this.db;
    const id = uuid();

    await db.insert(contactMessages).values({
      id,
      name: dto.name,
      email: dto.email,
      subject: dto.subject || 'General Inquiry',
      message: dto.message,
      status: 'unread',
    });

    return {
      success: true,
      messageId: id,
      message: 'Your message has been received! Our executives will get back to you shortly.',
    };
  }

  async findAll() {
    const db = this.db;
    return db
      .select()
      .from(contactMessages)
      .orderBy(sql`${contactMessages.createdAt} DESC`);
  }

  async markAsRead(id: string, status: 'read' | 'unread' = 'read') {
    const db = this.db;
    const existing = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException('Message not found');
    }

    await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id));

    return { success: true, id, status };
  }

  async delete(id: string) {
    const db = this.db;
    const existing = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException('Message not found');
    }

    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return { success: true, message: 'Message deleted' };
  }
}
