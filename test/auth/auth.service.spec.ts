import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('config'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signToken', () => {
    it('should return a signed JWT token', async () => {
      const mockUserId = 1;
      const mockToken = 'mockToken';

      jwtService.signAsync = jest.fn().mockResolvedValue(mockToken);

      configService.get = jest.fn().mockImplementation((key) => {
        if (key === 'JWT_ACCESS_TOKEN_TTL') return '86400';
        if (key === 'JWT_SECRET') return 'secret';
      });

      const result = await authService.signToken(mockUserId);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockUserId },
        { expiresIn: 86400, secret: 'secret' },
      );
      expect(result).toBe(mockToken);
    });
  });
});
