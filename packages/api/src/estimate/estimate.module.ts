import { Module } from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { EstimateController } from './estimate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimateEntity } from './estimate.entity';
import { CompanyEntity } from 'src/company/company.entity';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([EstimateEntity, CompanyEntity])],
  controllers: [EstimateController],
  providers: [EstimateService, CompanyService],
})
export class EstimateModule {}
