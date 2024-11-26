import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let userService: UserService;
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            signToken: jest.fn().mockReturnValue('token'),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('findByUsername', () => {
    it('should return user when user exists', async () => {
      const mockUser = { id: 1, username: 'test_1' };
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.findByUsername('test_1');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'test_1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await userService.findByUsername('test_1');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'test_1' },
      });
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should return created user', async () => {
      const mockUser = { id: 1, username: 'test_1' };
      const mockUserName = mockUser.username;
      userRepository.save = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.create(mockUserName);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: mockUserName,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOrCreate', () => {
    it('should return user if user exists', async () => {
      const mockUser = { id: 1, username: 'test_1' };
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.findOrCreate({ username: 'test_1' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'test_1' },
      });
      expect(authService.signToken).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'token' });
    });

    it('should create a new user if user is not found', async () => {
      const mockUser = { id: 1, username: 'test_1' };
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);
      userRepository.create = jest.fn().mockReturnValue(mockUser);
      userRepository.save = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.findOrCreate({ username: 'test_1' });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'test_1' },
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        username: 'test_1',
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(authService.signToken).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'token' });
    });
  });
});
