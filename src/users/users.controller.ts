import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInUserDto } from './dtos/signin-user.dto';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInUserDto: SignInUserDto) {
    return this.userService.findOrCreate(signInUserDto);
  }
}
