import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './supplier.entity';
import { CompanyEntity } from 'src/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierEntity, CompanyEntity])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
