import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { eq, like, and, sql } from 'drizzle-orm';
import { getDb } from '../database/db';
import { blogPosts } from '../database/schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class BlogService {
  private get db() {
    return getDb();
  }

  async findAll(query: { search?: string; category?: string; tag?: string }) {
    const db = this.db;
    const conditions: any[] = [eq(blogPosts.published, true)];

    if (query.category) {
      conditions.push(eq(blogPosts.category, query.category));
    }

    let results = await db
      .select()
      .from(blogPosts)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions))
      .orderBy(sql`${blogPosts.createdAt} DESC`);

    // Search filter (title, excerpt, content)
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
          (post.content && post.content.toLowerCase().includes(searchLower)),
      );
    }

    // Tag filter
    if (query.tag) {
      const tagLower = query.tag.toLowerCase();
      results = results.filter((post) => {
        if (!post.tags) return false;
        try {
          const tags: string[] = JSON.parse(post.tags);
          return tags.some((t) => t.toLowerCase() === tagLower);
        } catch {
          return false;
        }
      });
    }

    // Parse tags JSON for response
    return results.map((post) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }));
  }

  async findBySlug(slug: string) {
    const db = this.db;
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (results.length === 0) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    const post = results[0];
    return {
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    };
  }

  async create(dto: CreateBlogDto) {
    const db = this.db;
    const id = uuid();
    const slug = slugify(dto.title);
    const now = new Date().toISOString();

    await db.insert(blogPosts).values({
      id,
      title: dto.title,
      slug,
      date: dto.date || now,
      category: dto.category || 'News',
      author: dto.author,
      authorRole: dto.authorRole,
      readTime: dto.readTime || '4 min read',
      excerpt: dto.excerpt,
      content: dto.content,
      tags: dto.tags ? JSON.stringify(dto.tags) : null,
      image: dto.image,
      published: dto.published !== undefined ? dto.published : true,
    });

    return this.findBySlug(slug);
  }

  async update(id: string, dto: UpdateBlogDto) {
    const db = this.db;

    // Check exists
    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (dto.title !== undefined) {
      updateData.title = dto.title;
      updateData.slug = slugify(dto.title);
    }
    if (dto.date !== undefined) updateData.date = dto.date;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.author !== undefined) updateData.author = dto.author;
    if (dto.authorRole !== undefined) updateData.authorRole = dto.authorRole;
    if (dto.readTime !== undefined) updateData.readTime = dto.readTime;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.tags !== undefined) updateData.tags = JSON.stringify(dto.tags);
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.published !== undefined) updateData.published = dto.published;

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));

    const updated = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    return {
      ...updated[0],
      tags: updated[0].tags ? JSON.parse(updated[0].tags) : [],
    };
  }

  async delete(id: string) {
    const db = this.db;

    const existing = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Blog post with id "${id}" not found`);
    }

    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return { message: 'Blog post deleted successfully' };
  }
}
