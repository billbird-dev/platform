import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

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
