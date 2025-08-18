// src/files/files.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { MinioService } from '../minio/minio.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly minio: MinioService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // default multer: memory storage -> ada file.buffer
  async upload(@UploadedFile() file: Express.Multer.File) {
    const name = `${Date.now()}-${file.originalname}`;
    await this.minio.upload(name, file.buffer, file.mimetype);
    return { fileName: name };
  }

  @Get(':file/url')
  async url(@Param('file') file: string) {
    const url = await this.minio.getPresignedUrl(file, 300); // 5 menit
    return { url };
  }

  @Get(':file/download')
  async download(@Param('file') file: string, @Res() res: Response) {
    const stream = await this.minio.getStream(file);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${file}"`);
    stream.pipe(res);
  }
}
