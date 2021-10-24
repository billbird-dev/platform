// import { LocalAuthenticationGuard } from './localAuth.guard';
import { Body, Req, Controller, HttpCode, Post, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateCompanyDto } from 'src/company/company.dto';
import { RequestWithCompany } from './auth.interfaces';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: CreateCompanyDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  // @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithCompany, @Res() res: Response) {
    const { company } = request;
    const cookie = this.authService.getCookieWithJwtToken(company.id);

    res.setHeader('Set-Cookie', cookie);
    return { ...company, password: undefined };
  }
}
