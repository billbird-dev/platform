import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export interface FindCompany {
  email?: string;
  username?: string;
}

export class CreateCompanyDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsNumber()
  phone: number;

  @IsBoolean()
  is_premium_member: boolean;

  @IsBoolean()
  is_parent: boolean;

  @IsOptional()
  @IsNumber()
  parent?: number;

  @IsString()
  branch: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsNumber()
  pincode: number;

  @IsString()
  gstin: string;

  @IsString()
  state_code: string;
}
