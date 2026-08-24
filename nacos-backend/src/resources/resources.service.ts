import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { eq, and, sql } from 'drizzle-orm';
import { getDb } from '../database/db';
import { resources } from '../database/schema';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  private get db() {
    return getDb();
  }

  async findAll(query: { dept?: string; level?: string; semester?: string }) {
    const db = this.db;
    const conditions: any[] = [];

    if (query.dept) {
      conditions.push(eq(resources.dept, query.dept));
    }
    if (query.level) {
      conditions.push(eq(resources.level, query.level));
    }
    if (query.semester) {
      conditions.push(eq(resources.semester, query.semester));
    }

    if (conditions.length > 0) {
      return db
        .select()
        .from(resources)
        .where(conditions.length === 1 ? conditions[0] : and(...conditions))
        .orderBy(sql`${resources.createdAt} DESC`);
    }

    return db
      .select()
      .from(resources)
      .orderBy(sql`${resources.createdAt} DESC`);
  }

  async findById(id: string) {
    const db = this.db;
    const results = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (results.length === 0) {
      throw new NotFoundException(`Resource with id "${id}" not found`);
    }

    return results[0];
  }

  async create(dto: CreateResourceDto, filePath?: string) {
    const db = this.db;
    const id = uuid();

    await db.insert(resources).values({
      id,
      code: dto.code,
      title: dto.title,
      dept: dto.dept || 'Computer Sciences',
      level: dto.level || '100 Level',
      semester: dto.semester || '1st Semester',
      year: dto.year || '2025/2026',
      size: dto.size || '1.0 MB',
      filePath: filePath || null,
    });

    return this.findById(id);
  }

  async update(id: string, dto: UpdateResourceDto, filePath?: string) {
    const db = this.db;

    const existing = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Resource with id "${id}" not found`);
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (dto.code !== undefined) updateData.code = dto.code;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.dept !== undefined) updateData.dept = dto.dept;
    if (dto.level !== undefined) updateData.level = dto.level;
    if (dto.semester !== undefined) updateData.semester = dto.semester;
    if (dto.year !== undefined) updateData.year = dto.year;
    if (dto.size !== undefined) updateData.size = dto.size;
    if (filePath) updateData.filePath = filePath;

    await db.update(resources).set(updateData).where(eq(resources.id, id));

    return this.findById(id);
  }

  async delete(id: string) {
    const db = this.db;

    const existing = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Resource with id "${id}" not found`);
    }

    await db.delete(resources).where(eq(resources.id, id));
    return { message: 'Resource deleted successfully' };
  }
}
