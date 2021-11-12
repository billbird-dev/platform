import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { PurchasePreferencesDto } from 'src/preferences/preferences.dto';
import { PreferencesService } from 'src/preferences/preferences.service';
import { CreatePurchaseDto, UpdatePurchaseDto } from './purchase.dto';
import { PurchaseService } from './purchase.service';

@ApiTags('purchase')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('purchase')
export class PurchaseController {
  constructor(
    private readonly purchaseService: PurchaseService,
    private readonly prefService: PreferencesService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Req() request: RequestWithCompany, @Body() purchaseData: CreatePurchaseDto) {
    return this.purchaseService.create(request.user, purchaseData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getAllInvoices(@Req() req: RequestWithCompany) {
    return this.purchaseService.findAll(req.user.id);
  }

  @Get('invoice')
  findOne(@Query('company') company: number, @Query('id') id: number) {
    return this.purchaseService.findOne(company, id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('preferences')
  getPreferences(@Req() req: RequestWithCompany) {
    return this.prefService.getPurchasePref(req.user.id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('preferences')
  managePrefs(@Req() req: RequestWithCompany, @Body() prefData: PurchasePreferencesDto) {
    return this.prefService.createOrUpdatePurchasePref(req.user.id, prefData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  getById(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.purchaseService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(
    @Req() req: RequestWithCompany,
    @Param('id') id: number,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(req.user.id, id, updatePurchaseDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.purchaseService.remove(+id);
  // }
}
