// src/minio/minio.service.ts
import { Inject, Injectable, Logger, StreamableFile } from '@nestjs/common';
import * as Minio from 'minio';
import { Readable } from 'stream';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly bucket = 'products';

  constructor(@Inject('MINIO_CLIENT') private readonly client: Minio.Client) {
    this.ensureBucket().catch((e) =>
      this.logger.error(`ensureBucket error: ${e?.message ?? e}`),
    );
  }

  private async ensureBucket() {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket, 'us-east-1');
        this.logger.log(`Bucket "${this.bucket}" created`);
      }
    } catch (err) {
      // kalau server MinIO belum up, biarkan app tetap jalan; log saja
      this.logger.warn(`Bucket check failed: ${err?.message ?? err}`);
    }
  }

  async upload(fileName: string, buffer: Buffer, mime: string): Promise<string> {
    await this.client.putObject(
      this.bucket,
      fileName,
      buffer,
      buffer.length, // penting untuk Buffer
      { 'Content-Type': mime },
    );
    this.logger.log(`Uploaded: ${fileName}`);
    return fileName;
  }  

  async getPresignedUrl(fileName: string, expirySec = 300): Promise<string> {
    return this.client.presignedGetObject(this.bucket, fileName, expirySec);
  }

  async getStream(fileName: string): Promise<Readable> {
    return this.client.getObject(this.bucket, fileName);
  }

  // helper optional: langsung jadikan StreamableFile
  async downloadAsStreamable(fileName: string, mime = 'application/octet-stream') {
    const stream = await this.getStream(fileName);
    return new StreamableFile(stream, { type: mime, disposition: `inline; filename="${fileName}"` });
  }
}
