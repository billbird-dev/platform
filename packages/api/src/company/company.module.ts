import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { CompanyController } from './company.controller';
import { CompanyEntity } from './company.entity';
import { CompanyService } from './company.service';
import { RoleEntity } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, RoleEntity, ProductEntity])],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
