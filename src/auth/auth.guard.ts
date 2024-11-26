import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const jwtSignOption: JwtSignOptions = {
        expiresIn: parseInt(
          this.configService.get('JWT_ACCESS_TOKEN_TTL') ?? '86400',
        ),
        secret: this.configService.get('JWT_SECRET'),
      };
      const jwtPayload = await this.jwtService.verifyAsync(
        token,
        jwtSignOption,
      );
      request.user = jwtPayload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token ?? '';
  }
}
