import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CompanyService } from '../company/company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from '../company/company.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyEntity]),
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  providers: [AuthService, CompanyService, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
