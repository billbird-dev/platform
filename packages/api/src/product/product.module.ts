import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './product.service';
import { InventoryController } from './product.controller';
import { ProductEntity } from './product.entity';
import { CompanyEntity } from 'src/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CompanyEntity])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
