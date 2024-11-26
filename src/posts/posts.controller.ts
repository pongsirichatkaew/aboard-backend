import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserData } from 'src/auth/auth.decorator';
import { AccessTokenGuard } from 'src/auth/auth.guard';
import { BoardUserData } from 'src/auth/auth.interface';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get()
  get() {
    return this.postService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPostDto: CreatePostDto,
    @UserData() userData: BoardUserData,
  ) {
    return this.postService.create(createPostDto, userData.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @UserData() userData: BoardUserData,
  ) {
    return this.postService.update(postId, updatePostDto, userData.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseIntPipe) postId: number,
    @UserData() userData: BoardUserData,
  ) {
    return this.postService.delete(postId, userData.sub);
  }
}
