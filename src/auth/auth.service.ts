import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signToken(userId: number) {
    const jwtSignOption: JwtSignOptions = {
      expiresIn: parseInt(
        this.configService.get('JWT_ACCESS_TOKEN_TTL') ?? '86400',
      ),
      secret: this.configService.get('JWT_SECRET'),
    };

    return this.jwtService.signAsync({ sub: userId }, jwtSignOption);
  }
}
