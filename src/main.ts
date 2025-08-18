import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // drop fields tak dikenal
      transform: true,             // ubah tipe sesuai DTO (string -> number, dll)
      forbidNonWhitelisted: true,  // tolak fields tak dikenal
    }),
  );
  app.useGlobalInterceptors(new HttpLoggingInterceptor());
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, doc);
  await app.listen(3000);
}
bootstrap();
