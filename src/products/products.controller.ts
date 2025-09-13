import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll(): Promise<Product[]> {
    console.log('env username', process.env.DB_USERNAME);
    const result = await this.productsService.findAll();
    return result;
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    const result = await this.productsService.findOne(Number(id));
    return result;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Macbook Air M4' },
        description: { type: 'string', example: 'Laptop Sekolah' },
        price: { type: 'number', example: 19000000 },
        image: { type: 'string', format: 'binary' },
      },
      required: ['name', 'price'],
    },
  })
  async create(
    @Body() body: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.create(body, file);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Macbook Air M4' },
        description: { type: 'string', example: 'Laptop Sekolah' },
        price: { type: 'number', example: 19000000 },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() body: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.productsService.update(Number(id), body, file);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.productsService.remove(Number(id));
    return result;
  }
}
