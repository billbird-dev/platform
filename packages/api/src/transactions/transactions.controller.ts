import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('transactions')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthenticationGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getTransactions(@Req() req: RequestWithCompany) {
    return this.transactionsService.getTransaction(req.user.id);
  }
}
