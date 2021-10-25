import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from '../company/company.dto';
import { LoginUserDto, RequestWithCompany } from './auth.interfaces';
import { Response } from 'express';
import { CompanyService } from '../company/company.service';
import JwtRefreshGuard from './jwt-refresh.guard';
import JwtAuthenticationGuard from './jwt-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly companyService: CompanyService,
  ) {}

  @HttpCode(201)
  @Post('register')
  async register(@Body() registrationData: CreateCompanyDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @Post('login')
  async logIn(@Body() body: LoginUserDto, @Res() res: Response) {
    try {
      const company = await this.authService.getAuthenticatedUser(body.key, body.password);

      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(company.id);
      const { cookie: refreshTokenCookie, token } = this.authService.getCookieWithJwtRefreshToken(
        company.id,
      );

      await this.companyService.setCurrentRefreshToken(token, company.id);

      res.header('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

      res.send({ ...company, password: undefined, currentHashedRefreshToken: undefined });
      return company;
    } catch (error) {
      throw new HttpException('Some error occured', 500);
    }
  }

  @UseGuards(JwtAuthenticationGuard, JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithCompany, @Res() res: Response) {
    try {
      const { cookie: refreshTokenCookie, token } = this.authService.getCookieWithJwtRefreshToken(
        request.user.id,
      );
      const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);

      await this.companyService.setCurrentRefreshToken(token, request.user.id);

      res.header('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

      res.send();
    } catch (error) {
      console.log(error);

      throw new HttpException('Some error occured', 500);
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithCompany) {
    await this.companyService.removeRefreshToken(request.user.id);
    request.res.header('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}