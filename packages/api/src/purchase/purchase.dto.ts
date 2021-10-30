import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNumber, ValidateNested } from 'class-validator';
import { PurchaseItem } from './purchase-item.interface';

export class CreatePurchaseDto {
  @IsDateString()
  date: Date = new Date();

  @IsNumber()
  supplier: number;

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
  @ValidateNested({ each: true })
  @Type(() => PurchaseItem)
  items: PurchaseItem[];
}

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {}
