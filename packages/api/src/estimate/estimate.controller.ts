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
import { CreateEstimateDto, UpdateEstimateDto } from './estimate.dto';
import { EstimateService } from './estimate.service';

@ApiTags('estimate')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('estimate')
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  create(@Req() request: RequestWithCompany, @Body() estimateData: CreateEstimateDto) {
    return this.estimateService.create(request.user, estimateData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getAllInvoices(@Req() req: RequestWithCompany) {
    return this.estimateService.findAll(req.user.id);
  }

  @Get('invoice')
  findOne(@Query('company') company: number, @Query('id') id: number) {
    return this.estimateService.findOne(company, id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  getById(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.estimateService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  update(
    @Req() req: RequestWithCompany,
    @Param('id') id: number,
    @Body() updateEstimateDto: UpdateEstimateDto,
  ) {
    return this.estimateService.update(req.user.id, id, updateEstimateDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.estimateService.remove(+id);
  // }
}
