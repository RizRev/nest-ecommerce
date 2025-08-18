/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  description?: string;

  // karena multipart, price datang sebagai string -> transform ke number
  @Transform(({ value }) =>
    value === '' || value === null ? undefined : Number(value),
  )
  @IsNumber({}, { message: 'price must be a number' })
  price!: number;
}
