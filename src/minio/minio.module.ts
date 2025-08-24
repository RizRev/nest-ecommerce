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
          endPoint:
            process.env.MINIO_HOST! ||
            'minio-mww0s0oos04o0gg8k0k4w04c.194.31.53.73.sslip.io',
          port: undefined,
          useSSL:
            (process.env.MINIO_USE_SSL ?? 'false').toLowerCase() === 'true',
          accessKey: process.env.MINIO_ACCESS_KEY! || 'IajceRafe9iMI55o',
          secretKey: process.env.MINIO_SECRET_KEY! || 'GBExKraXCpQZQThmB2u7Ki1KrRncw6C8',
        });
      },
    },
    MinioService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
