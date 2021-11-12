import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EstimateItem } from './estimate-item.interface';

export class CreateEstimateDto {
  @IsOptional()
  @IsDateString()
  date?: Date = new Date();

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
  net_amount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EstimateItem)
  items: EstimateItem[];
}

export class UpdateEstimateDto extends PickType(CreateEstimateDto, [
  'date',
  'billing_address',
  'shipping_address',
]) {}
