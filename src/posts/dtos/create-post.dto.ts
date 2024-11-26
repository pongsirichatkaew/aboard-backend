import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PostCommunity } from '../enums/posts.enums';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(PostCommunity)
  community: PostCommunity;
}
