import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignInUserDto } from './dtos/signin-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(username: string): Promise<User> {
    const newUser = this.userRepository.create({ username });
    return this.userRepository.save(newUser);
  }

  async findOrCreate(signInUserDto: SignInUserDto): Promise<User> {
    const { username } = signInUserDto;
    let user = await this.findByUsername(username);
    if (!user) {
      user = await this.create(username);
    }
    return user;
  }
}
