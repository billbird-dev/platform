import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { CreateCustomerDto, updateCustomerDto } from './customer.dto';
import { CustomerService } from './customer.service';

@ApiTags('customer')
@UseGuards(JwtAuthenticationGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode(201)
  async create(@Req() req: RequestWithCompany, @Body() customerData: CreateCustomerDto) {
    return await this.customerService.createCustomer(customerData, req.user.id);
  }

  @Get()
  findAll(@Req() req: RequestWithCompany) {
    return this.customerService.getAllCustomers(req.user.id);
  }

  @Get('/child/:id')
  getChildCustomers(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.customerService.getChildCustomers(req.user.id, +id);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.customerService.getById(req.user.id, +id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithCompany,
    @Param('id') id: number,
    @Body() customerData: updateCustomerDto,
  ) {
    return this.customerService.updateById(req.user.id, +id, customerData);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.customerService.deleteById(req.user.id, id);
  }
}
