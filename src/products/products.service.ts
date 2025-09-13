import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private minio: MinioService,
  ) {}

  async findAll() {
    const result = await this.productRepo.find();
    return Promise.all(
      result.map(async (p) => ({
        ...p,
        attachmentUrl: p.attachmentKey
          ? await this.minio.getPresignedUrl(p.attachmentKey, 300)
          : null,
      })),
    );
  }

  async findOne(id: number) {
    const result = await this.productRepo.findOneBy({ id });
    return {
      ...result,
      attachmentUrl: result.attachmentKey
        ? await this.minio.getPresignedUrl(result.attachmentKey, 300)
        : null,
    };
  }

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const product = new Product();

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;

    if (file?.buffer) {
      const key = `products/${Date.now()}-${file.originalname}`;
      await this.minio.upload(key, file.buffer, file.mimetype);
      product.attachmentKey = key;
      product.attachmentMime = file.mimetype;
      product.attachmentSize = file.size;
      product.attachmentOriginalName = file.originalname;
    }
    const saved = await this.productRepo.save(product);
    return saved;
  }

  async update(id: number, data: Partial<Product>, file?: Express.Multer.File) {
    if (file?.buffer) {
      const key = `products/${Date.now()}-${file.originalname}`;
      await this.minio.upload(key, file.buffer, file.mimetype);
      data.attachmentKey = key;
      data.attachmentMime = file.mimetype;
      data.attachmentSize = file.size;
      data.attachmentOriginalName = file.originalname;
    }
    await this.productRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.productRepo.delete(id);
    return { deleted: true };
  }
}
