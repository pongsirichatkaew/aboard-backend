import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from '../dtos/update-post.dto';
import { Post } from '../entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'comments', 'comments.user'],
      order: {
        createdAt: 'ASC',
        comments: {
          createdAt: 'ASC',
        },
      },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(`Post ${id} is not found`);
    }
    return post;
  }

  async create(createPostDto: CreatePostDto, userId: number) {
    const post = this.postRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    await this.postRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    let post = await this.findOne(id);

    if (post.user.id !== userId) {
      throw new ForbiddenException(`Post ${id} is not accessible`);
    }

    post = { ...post, ...updatePostDto };
    await this.postRepository.save(post);
  }

  async delete(id: number, userId: number) {
    const post = await this.findOne(id);

    if (post.user.id !== userId) {
      throw new ForbiddenException(`Post ${id} is not accessible`);
    }

    await this.postRepository.remove(post);
  }
}
