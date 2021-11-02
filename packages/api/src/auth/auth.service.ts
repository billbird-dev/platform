import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { CreateCompanyDto, FindCompany } from '../company/company.dto';
import { CompanyService } from '../company/company.service';
import { PostgresErrorCode } from './auth.enum';
import { TokenPayload } from './auth.interfaces';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(companyData: CreateCompanyDto) {
    if (!companyData.password)
      throw new HttpException('Password not found', HttpStatus.BAD_REQUEST);

    const hashedPass = await hash(companyData.password, 10);
    try {
      const newCompany = await this.companyService.createCompany({
        ...companyData,
        password: hashedPass,
      });

      return newCompany;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Company exists with same credentials', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAuthenticatedUser(key: FindCompany, password: string) {
    try {
      const company = await this.companyService.getCompanyByEmailUsername(key);

      await this.verifyPassword(password, company.password);

      return company;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);

    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookieWithJwtAccessToken(companyId: number) {
    const payload: TokenPayload = { companyId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '15m',
    });

    return `__bta=${token}; HttpOnly; Secure; Path=/; Max-Age=900`;
  }

  public getCookieWithJwtRefreshToken(companyId: number) {
    const payload: TokenPayload = { companyId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    const cookie = `__btar=${token}; HttpOnly; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;

    return {
      cookie,
      token,
    };
  }

  public getCookiesForLogOut() {
    return [
      `__bta=; HttpOnly; Secure; Path=/; Max-Age=0`,
      `__btar=; HttpOnly; Secure; Path=/; Max-Age=0`,
    ];
  }
}
