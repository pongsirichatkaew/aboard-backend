import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/users/users.service';
import { UsersController } from '../../src/users/users.controller';
import { SignInUserDto } from '../../src/users/dtos/signin-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findOrCreate: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    userService = module.get<UserService>(UserService);
  });

  describe('signIn', () => {
    it('should find or create a user and return user', async () => {
      const signInUserDto: SignInUserDto = { username: 'test' };
      const mockUser = { id: 1, username: 'john_doe' };

      userService.findOrCreate = jest.fn().mockResolvedValue(mockUser);

      const result = await usersController.signIn(signInUserDto);
      expect(userService.findOrCreate).toHaveBeenCalledWith(signInUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when user cannot created', async () => {
      const signInUserDto: SignInUserDto = { username: 'john_doe' };

      userService.findOrCreate = jest
        .fn()
        .mockRejectedValue(new Error('mockError'));

      await expect(usersController.signIn(signInUserDto)).rejects.toThrow(
        'mockError',
      );
      expect(userService.findOrCreate).toHaveBeenCalledWith(signInUserDto);
    });
  });
});
