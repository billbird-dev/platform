import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { CreateSupplierDto, updateSupplierDto } from './supplier.dto';
import { SupplierService } from './supplier.service';

@ApiTags('supplier')
@UseGuards(JwtAuthenticationGuard)
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(201)
  async create(@Req() req: RequestWithCompany, @Body() supplierData: CreateSupplierDto) {
    return await this.supplierService.createSupplier(supplierData, req.user.id);
  }

  @Get()
  findAll(@Req() req: RequestWithCompany) {
    return this.supplierService.getAllSuppliers(req.user.id);
  }

  @Get('/child/:id')
  getChildSuppliers(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.supplierService.getChildSuppliers(req.user.id, id);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.supplierService.getById(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithCompany,
    @Param('id') id: number,
    @Body() supplierData: updateSupplierDto,
  ) {
    return this.supplierService.updateById(req.user.id, id, supplierData);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.supplierService.deleteById(req.user.id, id);
  }
}
