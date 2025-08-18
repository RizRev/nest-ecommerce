import { Module } from '@nestjs/common';
import { FilesController } from './file.controller';
import { FileService } from './file.service';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [MinioModule],
  controllers: [FilesController],
  providers: [FileService],
})
export class FileModule {}
