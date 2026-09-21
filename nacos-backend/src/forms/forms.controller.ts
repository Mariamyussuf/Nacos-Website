import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { FormsService } from './forms.service';
import { CreateFormDto, UpdateFormDto } from './dto/create-form.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

import { CaptchaService } from '../captcha/captcha.service';

// ── File storage for form file-upload fields ─────────────────────────────────

const formFileStorage = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads', 'form-files'),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const ALLOWED_FORM_FILE_EXTS = /\.(jpg|jpeg|png|gif|webp|pdf|doc|docx|xlsx|csv|txt|zip)$/i;

@Controller('forms')
export class FormsController {
  constructor(
    private readonly formsService: FormsService,
    private readonly captchaService: CaptchaService,
  ) {}

  // ── Admin-only routes (require session auth) ──────────────────────────────

  /** List all forms */
  @UseGuards(AuthenticatedGuard)
  @Get()
  findAll() {
    return this.formsService.findAll();
  }

  /** Get single form by ID (admin) */
  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formsService.findById(id);
  }

  /** Create a new form */
  @UseGuards(AuthenticatedGuard)
  @Post()
  create(@Body() dto: CreateFormDto) {
    return this.formsService.create(dto);
  }

  /** Update form (title, fields, status, etc.) */
  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFormDto) {
    return this.formsService.update(id, dto);
  }

  /** Delete form and all its submissions */
  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.formsService.delete(id);
  }

  /** Get all submissions for a form (admin only) */
  @UseGuards(AuthenticatedGuard)
  @Get(':id/submissions')
  getSubmissions(@Param('id') id: string) {
    return this.formsService.getSubmissions(id);
  }

  // ── Public routes (no auth required) ─────────────────────────────────────

  /** Get a published form by its slug (for public rendering) */
  @Get('public/:slug')
  getPublic(@Param('slug') slug: string) {
    return this.formsService.findBySlug(slug);
  }

  /**
   * Submit a response to a published form.
   * Accepts multipart/form-data so file-upload fields can be attached.
   * The JSON data fields must be sent as a stringified JSON body under the "data" field.
   */
  @Post(':id/submit')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: formFileStorage,
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_FORM_FILE_EXTS.test(extname(file.originalname))) {
          return cb(
            new BadRequestException(
              'File type not allowed. Accepted: images, PDF, DOC, XLSX, CSV, TXT, ZIP',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
    }),
  )
  async submit(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFiles() uploadedFiles: Express.Multer.File[],
    @Req() req: any,
  ) {
    // Parse data field — may come as JSON string in multipart
    let data: Record<string, any> = {};
    if (body.data) {
      try {
        data = JSON.parse(body.data);
      } catch {
        data = body; // fallback: raw key-value pairs
      }
    } else {
      // Pure JSON body (no file uploads)
      data = body;
    }

    // Build file map: fieldId → { url, originalName }
    const files: Record<string, { url: string; originalName: string }> = {};
    if (uploadedFiles && uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        const url = `/uploads/form-files/${file.filename}`;
        files[file.fieldname] = { url, originalName: file.originalname };
      }
    }

    // Extract real IP (supports proxies)
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip ||
      'unknown';

    // Verify CAPTCHA (from headers or body)
    const captchaToken = (req.headers['x-captcha-token'] as string) || body.captchaToken || data.captchaToken;
    const captchaAnswer = (req.headers['x-captcha-answer'] as string) || body.captchaAnswer || data.captchaAnswer;

    delete data.captchaToken;
    delete data.captchaAnswer;

    if (captchaToken || process.env.REQUIRE_CAPTCHA === 'true') {
      this.captchaService.verify(captchaToken, captchaAnswer);
    }

    return this.formsService.submit(id, data, ip, files);
  }
}
