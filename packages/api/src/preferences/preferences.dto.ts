import { IsNumber, IsOptional } from 'class-validator';

export class SalePreferencesDto {
  @IsOptional()
  @IsNumber()
  cgst_percent: number;

  @IsOptional()
  @IsNumber()
  sgst_percent: number;

  @IsOptional()
  @IsNumber()
  igst_percent: number;

  @IsOptional()
  @IsNumber()
  discount_percent: number;
}

export class PurchasePreferencesDto {
  @IsOptional()
  @IsNumber()
  cgst_percent: number;

  @IsOptional()
  @IsNumber()
  sgst_percent: number;

  @IsOptional()
  @IsNumber()
  igst_percent: number;

  @IsOptional()
  @IsNumber()
  discount_percent: number;
}
