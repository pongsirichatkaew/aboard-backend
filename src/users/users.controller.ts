import { Controller, Get } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  testCreate() {
    return this.userService.create('test3');
  }
}
