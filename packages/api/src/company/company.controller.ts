import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { UpdateProfileDto } from './company.dto';
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

  @Patch()
  updateCompany(@Req() req: RequestWithCompany, @Body() updateCompany: UpdateProfileDto) {
    return this.companyService.updateCompany(req.user.id, updateCompany);
  }

  @Get('children')
  async getChildrenCompanies(@Req() request: RequestWithCompany) {
    if (!request.user.is_parent) throw new HttpException('Not a parent company', 400);

    return this.companyService.getChildren(request.user.id);
  }
}
