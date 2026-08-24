import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getDb } from '../database/db';
import { admins } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AuthService {
  async validateAdmin(username: string, password: string) {
    const db = getDb();
    const results = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (results.length === 0) return null;

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return null;

    // Return admin without password
    const { password: _, ...safeAdmin } = admin;
    return safeAdmin;
  }

  async findById(id: string) {
    const db = getDb();
    const results = await db
      .select({
        id: admins.id,
        username: admins.username,
        role: admins.role,
        createdAt: admins.createdAt,
      })
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1);

    return results[0] || null;
  }
}
