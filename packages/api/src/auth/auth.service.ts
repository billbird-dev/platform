import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { CreateCompanyDto, FindCompany } from 'src/company/company.dto';
import { CompanyService } from 'src/company/company.service';
import { PostgresErrorCode } from './auth.enum';
import { TokenPayload } from './auth.interfaces';

@Injectable()
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

      return { ...newCompany, password: undefined };
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

      return { ...company, password: undefined };
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

    return `__Host-Authentication=${token}; HttpOnly; Path=/; Max-Age=900`;
  }

  public getCookieWithJwtRefreshToken(companyId: number) {
    const payload: TokenPayload = { companyId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    const cookie = `__Host-Refresh=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`;

    return {
      cookie,
      token,
    };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
