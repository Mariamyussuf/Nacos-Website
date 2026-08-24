import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { v4 as uuid } from 'uuid';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

const pdfStorage = diskStorage({
  destination: join(__dirname, '..', '..', 'uploads', 'pdfs'),
  filename: (_req, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  findAll(
    @Query('dept') dept?: string,
    @Query('level') level?: string,
    @Query('semester') semester?: string,
  ) {
    return this.resourcesService.findAll({ dept, level, semester });
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const resource = await this.resourcesService.findById(id);
    if (!resource.filePath) {
      throw new NotFoundException('No file attached to this resource');
    }

    const absolutePath = join(__dirname, '..', '..', resource.filePath);
    if (!existsSync(absolutePath)) {
      throw new NotFoundException('File not found on disk');
    }

    return res.download(absolutePath);
  }

  @UseGuards(AuthenticatedGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: pdfStorage }))
  create(
    @Body() dto: CreateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const filePath = file ? `uploads/pdfs/${file.filename}` : undefined;
    return this.resourcesService.create(dto, filePath);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage: pdfStorage }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const filePath = file ? `uploads/pdfs/${file.filename}` : undefined;
    return this.resourcesService.update(id, dto, filePath);
  }

  @UseGuards(AuthenticatedGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.resourcesService.delete(id);
  }
}
