import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/company/company.entity';
import { TransactionsEntity } from './transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, TransactionsEntity])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
