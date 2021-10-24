import { Controller, Get, HttpException, Req, UseGuards } from '@nestjs/common';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';

@Controller('company')
export class CompanyController {
  @UseGuards(JwtAuthenticationGuard)
  @Get('/')
  async getProfile(@Req() request: RequestWithCompany) {
    console.log(request);

    if (!!request.user) {
      return request.user;
    }

    throw new HttpException('Company not found', 404);
  }
}
