import { IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
