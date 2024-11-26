import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostCommentDto } from '../dtos/create-post-comment.dto';
import { PostComment } from '../entities/post-comment.entity';
import { PostsService } from './posts.service';

@Injectable()
export class PostCommentService {
  constructor(
    @InjectRepository(PostComment)
    private readonly commentRepository: Repository<PostComment>,
    private readonly postService: PostsService,
  ) {}

  async addComment(
    id: number,
    createCommentDto: CreatePostCommentDto,
    userId: number,
  ) {
    const post = await this.postService.findOne(id);
    const comment = this.commentRepository.create({
      message: createCommentDto.message,
      post,
      user: { id: userId },
    });

    await this.commentRepository.save(comment);
  }
}
