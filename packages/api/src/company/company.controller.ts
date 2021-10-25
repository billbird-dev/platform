import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithCompany } from '../auth/auth.interfaces';
import JwtAuthenticationGuard from '../auth/jwt-auth.guard';

@Controller('company')
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  @UseGuards(JwtAuthenticationGuard)
  @Get('/')
  async getProfile(@Req() request: RequestWithCompany) {
    if (!!request.user) return request.user;

    throw new HttpException('Company not found', 404);
  }
}