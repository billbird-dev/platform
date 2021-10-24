import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  public async getAuthenticatedUser(key: FindCompany, hashedPassword: string) {
    try {
      const company = await this.companyService.getCompanyByEmailUsername(key);

      await this.verifyPassword(hashedPassword, company.password);

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

  public getCookieWithJwtToken(companyId: number) {
    const payload: TokenPayload = { companyId };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=15m`;
  }
}
