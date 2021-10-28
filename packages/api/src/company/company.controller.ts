import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { CompanyService } from './company.service';

@ApiTags('company')
@Controller('company')
@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getProfile(@Req() request: RequestWithCompany) {
    if (!!request.user) return request.user;

    throw new HttpException('Company not found', 404);
  }

  @Get('children')
  async getChildrenCompanies(@Req() request: RequestWithCompany) {
    if (!request.user.is_parent) throw new HttpException('Not a parent company', 400);

    return this.companyService.getChildren(request.user.id);
  }
}
