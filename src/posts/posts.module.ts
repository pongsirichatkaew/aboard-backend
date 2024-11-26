import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PostComment } from './entities/post-comment.entity';
import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostCommentService } from './services/post-comment.service';
import { PostsService } from './services/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostComment]), AuthModule],
  controllers: [PostsController],
  providers: [PostsService, PostCommentService],
})
export class PostsModule {}
