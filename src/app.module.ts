import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestControllerCliController } from './test-controller-cli/test-controller-cli.controller';
import { TestServiceCliService } from './test-service-cli/test-service-cli.service';
import { TestModuleCliModule } from './test-module-cli/test-module-cli.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './entities/product.entity';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { MinioModule } from './minio/minio.module';
import { FilesController } from './file/file.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TestModuleCliModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Product],
      synchronize: true, // dev only
      // Opsi pool untuk driver `pg`
      // extra: {
      //   max: 10, // ukuran pool
      //   idleTimeoutMillis: 30000, // idle timeout
      // },
    }),
    ProductsModule,
    FileModule,
    MinioModule,
    // TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController, TestControllerCliController, FilesController],
  providers: [AppService, TestServiceCliService],
})
export class AppModule {}
