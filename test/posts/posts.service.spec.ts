import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/services/posts.service';
import { Repository } from 'typeorm';

describe('PostsService', () => {
  let postsService: PostsService;
  let postRepository: Repository<Post>;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post',
    createdAt: new Date(),
    user: { id: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const mockPosts = [mockPost];
      postRepository.find = jest.fn().mockResolvedValue(mockPosts);

      const result = await postsService.findAll();

      expect(postRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'comments', 'comments.user'],
        order: {
          createdAt: 'ASC',
          comments: {
            createdAt: 'ASC',
          },
        },
      });
      expect(result).toEqual(mockPosts);
    });
  });

  describe('findOne', () => {
    it('should return post that found', async () => {
      postRepository.findOne = jest.fn().mockResolvedValue(mockPost);

      const result = await postsService.findOne(1);

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(result).toEqual(mockPost);
    });

    it('should throw a NotFoundException if post does not exist', async () => {
      postRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(postsService.findOne(1)).rejects.toThrow(NotFoundException);
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
    });
  });

  describe('create', () => {
    it('should create new post', async () => {
      const createPostDto: any = {
        title: 'title',
        content: 'content',
        community: 'Tech',
      };

      postRepository.create = jest.fn().mockReturnValue(mockPost);
      postRepository.save = jest.fn().mockResolvedValue(mockPost);

      await postsService.create(createPostDto, 1);

      expect(postRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        user: { id: 1 },
      });
      expect(postRepository.save).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('update', () => {
    it('should updated post if user is the owner', async () => {
      const updatePostDto: any = {
        title: 'updated',
      };

      postRepository.findOne = jest.fn().mockResolvedValue(mockPost);
      postRepository.save = jest.fn().mockResolvedValue(mockPost);

      await postsService.update(1, updatePostDto, 1);

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(postRepository.save).toHaveBeenCalledWith({
        ...mockPost,
        ...updatePostDto,
      });
    });

    it('should throw a ForbiddenException if user is not the owner', async () => {
      const updatePostDto: any = {
        title: 'updated',
      };

      postRepository.findOne = jest.fn().mockResolvedValue(mockPost);

      await expect(postsService.update(1, updatePostDto, 2)).rejects.toThrow(
        ForbiddenException,
      );
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(postRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should deleted post if user is the owner', async () => {
      postRepository.findOne = jest.fn().mockResolvedValue(mockPost);
      postRepository.remove = jest.fn().mockResolvedValue(undefined);

      await postsService.delete(1, 1);

      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw a ForbiddenException if user is not the owner', async () => {
      postRepository.findOne = jest.fn().mockResolvedValue(mockPost);

      await expect(postsService.delete(1, 2)).rejects.toThrow(
        ForbiddenException,
      );
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
      expect(postRepository.remove).not.toHaveBeenCalled();
    });
  });
});
