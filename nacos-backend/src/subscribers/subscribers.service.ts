import { Injectable, ConflictException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '../database/db';
import { subscribers } from '../database/schema';

@Injectable()
export class SubscribersService {
  private get db() {
    return getDb();
  }

  async subscribe(email: string) {
    const db = this.db;

    // Check if already subscribed
    const existing = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('This email is already subscribed');
    }

    await db.insert(subscribers).values({ email });

    return { message: 'Successfully subscribed!' };
  }

  async findAll() {
    const db = this.db;
    return db
      .select()
      .from(subscribers)
      .orderBy(sql`${subscribers.createdAt} DESC`);
  }
}
