import { ApiProperty } from '@nestjs/swagger';
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
  isPremiumMember: boolean;

  @IsBoolean()
  isParent: boolean;

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
  pinCode: number;

  @IsString()
  gstin: string;

  @IsString()
  stateCode: string;
}
