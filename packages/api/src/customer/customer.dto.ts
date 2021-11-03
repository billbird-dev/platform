import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  gstin: string;

  @IsString()
  @IsOptional()
  billing_address?: string;

  @IsString()
  @IsOptional()
  shipping_address?: string;

  @IsBoolean()
  @IsOptional()
  registered_gst_member?: boolean;
}

export class updateCustomerDto extends PartialType(CreateCustomerDto) {}
