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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { CreateSaleDto } from './sale.dto';
import { SaleService } from './sale.service';

@ApiTags('sale')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSaleDto: any) {
  //   return this.saleService.update(+id, updateSaleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.saleService.remove(+id);
  // }
}
