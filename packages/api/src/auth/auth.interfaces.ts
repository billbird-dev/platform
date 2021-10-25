import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Request } from 'express';
import { CompanyEntity } from '../company/company.entity';

export interface TokenPayload {
  companyId: number;
}

export interface RequestWithCompany extends Request {
  user: CompanyEntity;
  userId?: string;
}

class Key {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class LoginUserDto {
  @ValidateNested()
  @IsNotEmpty()
  key: Key;

  @IsNotEmpty()
  password: string;
}
