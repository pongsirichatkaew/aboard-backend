import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule],
  providers: [AuthService, JwtService, ConfigService, AccessTokenGuard],
  exports: [AuthService, JwtService, ConfigService, AccessTokenGuard],
})
export class AuthModule {}
