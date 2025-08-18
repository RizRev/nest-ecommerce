/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/minio/minio.module.ts
import { Global, Module } from '@nestjs/common';
import * as Minio from 'minio';
import { MinioService } from './minio.service';

@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      useFactory: () => {
        return new Minio.Client({
          endPoint: process.env.MINIO_HOST!,
          port: undefined,
          useSSL:
            (process.env.MINIO_USE_SSL ?? 'false').toLowerCase() === 'true',
          accessKey: process.env.MINIO_ACCESS_KEY!,
          secretKey: process.env.MINIO_SECRET_KEY!,
        });
      },
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
