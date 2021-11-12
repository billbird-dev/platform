import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { SalePreferencesDto } from 'src/preferences/preferences.dto';
import { PreferencesService } from 'src/preferences/preferences.service';
import { CreateSaleDto, UpdateSaleDto } from './sale.dto';
import { SaleService } from './sale.service';

@ApiTags('sale')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('sale')
export class SaleController {
  constructor(
    private readonly saleService: SaleService,
    private readonly prefService: PreferencesService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Req() request: RequestWithCompany, @Body() saleData: CreateSaleDto) {
    return this.saleService.create(request.user, saleData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getAllInvoices(@Req() req: RequestWithCompany) {
    return this.saleService.findAll(req.user.id);
  }

  @Get('invoice')
  findOne(@Query('company') company: number, @Query('id') id: number) {
    return this.saleService.findOne(company, id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  getById(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.saleService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('preferences')
  getPreferences(@Req() req: RequestWithCompany) {
    return this.prefService.getSalePref(req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('preferences')
  managePrefs(@Req() req: RequestWithCompany, @Body() prefData: SalePreferencesDto) {
    return this.prefService.createOrUpdateSalePref(req.user.id, prefData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(
    @Req() req: RequestWithCompany,
    @Param('id') id: number,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    return this.saleService.update(req.user.id, id, updateSaleDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.saleService.remove(+id);
  // }
}
