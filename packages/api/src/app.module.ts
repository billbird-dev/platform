import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/db.module';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './product/product.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [DatabaseModule, ConfigModule.forRoot(), CompanyModule, AuthModule, InventoryModule],
})
export class AppModule {}
