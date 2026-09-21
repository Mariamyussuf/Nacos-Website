import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { eq, sql } from 'drizzle-orm';
import { createHash } from 'crypto';
import { getDb } from '../database/db';
import { forms, formSubmissions } from '../database/schema';
import { CreateFormDto, UpdateFormDto } from './dto/create-form.dto';

@Injectable()
export class FormsService {
  private get db() {
    return getDb();
  }

  // ── Slug helper ────────────────────────────────────────────────────────────

  private toSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
  }

  private buildFingerprint(
    ip: string,
    data: Record<string, any>,
    fields: any[],
  ): string {
    // Build a reproducible fingerprint from IP + any email/matric field values
    const emailFields = fields
      .filter((f) => f.type === 'email' || f.label?.toLowerCase().includes('matric'))
      .map((f) => String(data[f.id] || '').toLowerCase().trim());

    const parts = [ip, ...emailFields].join('|');
    return createHash('sha256').update(parts).digest('hex');
  }

  // ── Admin CRUD ─────────────────────────────────────────────────────────────

  async findAll() {
    const db = this.db;
    const results = await db
      .select()
      .from(forms)
      .orderBy(sql`${forms.createdAt} DESC`);

    return results.map((f) => ({
      ...f,
      fields: f.fields ? JSON.parse(f.fields) : [],
    }));
  }

  async findById(id: string) {
    const db = this.db;
    const results = await db
      .select()
      .from(forms)
      .where(eq(forms.id, id))
      .limit(1);

    if (results.length === 0) {
      throw new NotFoundException(`Form with id "${id}" not found`);
    }

    const form = results[0];
    return { ...form, fields: form.fields ? JSON.parse(form.fields) : [] };
  }

  async findBySlug(slug: string) {
    const db = this.db;
    const results = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, slug))
      .limit(1);

    if (results.length === 0) {
      throw new NotFoundException(`Form "${slug}" not found`);
    }

    const form = results[0];
    return { ...form, fields: form.fields ? JSON.parse(form.fields) : [] };
  }

  async create(dto: CreateFormDto) {
    const db = this.db;
    const id = uuid();
    const rawSlug = dto.slug
      ? this.toSlug(dto.slug)
      : this.toSlug(dto.title) + '-' + id.slice(0, 6);

    // Check slug uniqueness
    const existing = await db
      .select()
      .from(forms)
      .where(eq(forms.slug, rawSlug))
      .limit(1);

    const slug = existing.length > 0 ? rawSlug + '-' + id.slice(0, 4) : rawSlug;

    await db.insert(forms).values({
      id,
      title: dto.title,
      slug,
      description: dto.description || null,
      fields: JSON.stringify(dto.fields || []),
      status: dto.status || 'draft',
      submissionCount: 0,
    });

    return this.findById(id);
  }

  async update(id: string, dto: UpdateFormDto) {
    const db = this.db;

    const existing = await db
      .select()
      .from(forms)
      .where(eq(forms.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Form with id "${id}" not found`);
    }

    const updateData: any = { updatedAt: new Date().toISOString() };
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.fields !== undefined) updateData.fields = JSON.stringify(dto.fields);
    if (dto.slug !== undefined) {
      const newSlug = this.toSlug(dto.slug);
      // Check uniqueness (excluding self)
      const collision = await db
        .select()
        .from(forms)
        .where(eq(forms.slug, newSlug))
        .limit(1);
      if (collision.length > 0 && collision[0].id !== id) {
        throw new ConflictException(`Slug "${newSlug}" is already taken`);
      }
      updateData.slug = newSlug;
    }

    await db.update(forms).set(updateData).where(eq(forms.id, id));
    return this.findById(id);
  }

  async delete(id: string) {
    const db = this.db;

    const existing = await db
      .select()
      .from(forms)
      .where(eq(forms.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException(`Form with id "${id}" not found`);
    }

    // Delete submissions too
    await db.delete(formSubmissions).where(eq(formSubmissions.formId, id));
    await db.delete(forms).where(eq(forms.id, id));

    return { message: 'Form deleted successfully' };
  }

  // ── Public Submission ──────────────────────────────────────────────────────

  async submit(
    formId: string,
    data: Record<string, any>,
    ip: string,
    files?: Record<string, { url: string; originalName: string }>,
  ) {
    const db = this.db;

    // Load form
    const formResults = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId))
      .limit(1);

    if (formResults.length === 0) {
      throw new NotFoundException('Form not found');
    }

    const form = formResults[0];

    if (form.status !== 'published') {
      throw new BadRequestException('This form is not currently accepting responses');
    }

    // Validate payload size cap
    if (JSON.stringify(data).length > 50000) {
      throw new BadRequestException('Form submission data payload exceeds maximum allowed size (50 KB)');
    }

    const fields: any[] = form.fields ? JSON.parse(form.fields) : [];

    // Comprehensive field-level validations
    for (const field of fields) {
      const val = data[field.id];
      const isProvided = val !== undefined && val !== null && String(val).trim() !== '';

      // 1. Required field check
      if (field.required && field.type !== 'file' && !isProvided) {
        throw new BadRequestException(`Field "${field.label}" is required`);
      }

      // If value is provided, enforce type constraints
      if (isProvided) {
        // Email validation
        if (field.type === 'email') {
          const emailStr = String(val).trim();
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(emailStr) || emailStr.length > 150) {
            throw new BadRequestException(`Field "${field.label}" must be a valid email address`);
          }
        }

        // Numeric validation
        if (field.type === 'number') {
          const num = Number(val);
          if (isNaN(num) || !isFinite(num)) {
            throw new BadRequestException(`Field "${field.label}" must be a valid numeric value`);
          }
        }

        // Short text length cap
        if (field.type === 'text') {
          if (String(val).length > 255) {
            throw new BadRequestException(`Field "${field.label}" exceeds maximum length of 255 characters`);
          }
        }

        // Long text / textarea length cap
        if (field.type === 'textarea') {
          if (String(val).length > 5000) {
            throw new BadRequestException(`Field "${field.label}" exceeds maximum length of 5,000 characters`);
          }
        }

        // Select / Dropdown & Radio option whitelisting
        if (field.type === 'select' || field.type === 'radio') {
          const options = Array.isArray(field.options) ? field.options : [];
          if (options.length > 0 && !options.includes(String(val))) {
            throw new BadRequestException(
              `Invalid selection for "${field.label}". Allowed options: ${options.join(', ')}`,
            );
          }
        }

        // Checkboxes option whitelisting
        if (field.type === 'checkboxes') {
          const selected = Array.isArray(val) ? val : [val];
          const options = Array.isArray(field.options) ? field.options : [];
          if (options.length > 0) {
            const hasInvalid = selected.some((item) => !options.includes(String(item)));
            if (hasInvalid) {
              throw new BadRequestException(`Invalid selection for checkboxes "${field.label}"`);
            }
          }
        }
      }
    }

    // Merge uploaded file URLs into data
    if (files) {
      for (const [fieldId, fileInfo] of Object.entries(files)) {
        data[fieldId] = fileInfo.url;
      }
    }

    // Build duplicate fingerprint
    const fingerprint = this.buildFingerprint(ip, data, fields);

    // Check for duplicate submission
    const duplicate = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.fingerprint, fingerprint))
      .limit(1);

    if (duplicate.length > 0) {
      throw new ConflictException(
        'You have already submitted this form. Duplicate submissions are not allowed.',
      );
    }

    const id = uuid();
    await db.insert(formSubmissions).values({
      id,
      formId,
      data: JSON.stringify(data),
      submitterIp: ip,
      fingerprint,
    });

    // Increment submission count
    await db
      .update(forms)
      .set({
        submissionCount: (form.submissionCount || 0) + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(forms.id, formId));

    return { success: true, message: 'Your response has been recorded. Thank you!' };
  }

  // ── Submissions Viewer ─────────────────────────────────────────────────────

  async getSubmissions(formId: string) {
    const db = this.db;

    // Verify form exists
    const formExists = await db
      .select()
      .from(forms)
      .where(eq(forms.id, formId))
      .limit(1);

    if (formExists.length === 0) {
      throw new NotFoundException(`Form with id "${formId}" not found`);
    }

    const results = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId))
      .orderBy(sql`${formSubmissions.submittedAt} DESC`);

    return results.map((s) => ({
      ...s,
      data: s.data ? JSON.parse(s.data) : {},
    }));
  }
}
