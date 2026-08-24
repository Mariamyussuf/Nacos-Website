import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

const imageStorage = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads', 'images'),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const pdfStorage = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads', 'pdfs'),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const imageFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  if (!allowed.test(extname(file.originalname))) {
    return cb(
      new BadRequestException('Only image files (jpg, png, gif, webp, svg) are allowed'),
      false,
    );
  }
  cb(null, true);
};

const pdfFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (extname(file.originalname).toLowerCase() !== '.pdf') {
    return cb(new BadRequestException('Only PDF files are allowed'), false);
  }
  cb(null, true);
};

@Controller('uploads')
export class UploadsController {
  @UseGuards(AuthenticatedGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imageStorage,
      fileFilter: imageFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    return {
      url: `/uploads/images/${file.filename}`,
      filename: file.filename,
      size: file.size,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: pdfStorage,
      fileFilter: pdfFilter,
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    }),
  )
  uploadPdf(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No PDF file provided');
    }
    return {
      url: `/uploads/pdfs/${file.filename}`,
      filename: file.filename,
      size: file.size,
    };
  }
}
