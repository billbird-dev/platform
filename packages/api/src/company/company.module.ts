import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyEntity } from './company.entity';
import { CompanyService } from './company.service';
import { RoleEntity } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, RoleEntity])],
  providers: [CompanyService],
  controllers: [CompanyController],
  exports: [CompanyService],
})
export class CompanyModule {}
