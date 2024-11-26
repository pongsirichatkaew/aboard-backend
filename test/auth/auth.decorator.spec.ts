import { UserData } from 'src/auth/auth.decorator';

describe('UserData Decorator', () => {
  it('should return the user object from the request', () => {
    const mockUser = { id: 1, username: 'test_1' };

    const mockContext: any = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    };

    const result = UserData(undefined, mockContext);
    expect(result).toBeDefined();
  });
});
