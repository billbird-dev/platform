import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './customer.entity';
import { CompanyEntity } from 'src/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity, CompanyEntity])],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
