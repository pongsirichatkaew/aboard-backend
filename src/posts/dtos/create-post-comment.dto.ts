import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostCommentDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
