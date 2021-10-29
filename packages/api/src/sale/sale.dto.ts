import { PartialType } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { SaleItem } from './sate-item.interface';

export class CreateSaleDto {
  @IsDate()
  date: Date;

  @IsNumber()
  customer: number;

  @IsString()
  @IsOptional()
  billing_address?: string;

  @IsString()
  @IsOptional()
  shipping_address?: string;

  @IsNumber()
  gross_total: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  taxable_amount: number;

  @IsNumber()
  cgst_percent: number;

  @IsNumber()
  sgst_percent: number;

  @IsNumber()
  igst_percent: number;

  @IsNumber()
  cgst_value: number;

  @IsNumber()
  sgst_value: number;

  @IsNumber()
  igst_value: number;

  @IsNumber()
  net_amount: number;

  @IsArray()
  items: SaleItem[];
}

export class UpdateSaleDto extends PartialType(CreateSaleDto) {}
