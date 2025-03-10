import { Test, TestingModule } from '@nestjs/testing';
import { AccessTokenGuard } from 'src/auth/auth.guard';
import { PostsController } from 'src/posts/posts.controller';
import { PostCommentService } from 'src/posts/services/post-comment.service';
import { PostsService } from 'src/posts/services/posts.service';

describe('PostsController', () => {
  let postsController: PostsController;
  let postCommentService: PostCommentService;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findMe: jest.fn(),
          },
        },
        {
          provide: PostCommentService,
          useValue: {
            addComment: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    postsController = module.get<PostsController>(PostsController);
    postCommentService = module.get<PostCommentService>(PostCommentService);
    postsService = module.get<PostsService>(PostsService);
  });

  describe('get', () => {
    it('should return all posts', async () => {
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      postsService.findAll = jest.fn().mockResolvedValue(mockPosts);

      const result = await postsController.get();

      expect(postsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });
  });

  describe('getMe', () => {
    it('should return all posts', async () => {
      const mockUserData = { sub: 1 };
      const mockPosts = [{ id: 1, title: 'Test Post' }];
      postsService.findMe = jest.fn().mockResolvedValue(mockPosts);

      const result = await postsController.getMe(mockUserData);

      expect(postsService.findMe).toHaveBeenCalled();
      expect(result).toEqual(mockPosts);
    });
  });

  describe('getById', () => {
    it('should return all posts', async () => {
      const mockPost = { id: 1, title: 'Test Post' };
      postsService.findOne = jest.fn().mockResolvedValue(mockPost);

      const result = await postsController.getById(1);

      expect(postsService.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockPost);
    });
  });

  describe('create', () => {
    it('should create new post', async () => {
      const createPostDto: any = {
        title: 'title',
        content: 'content',
        community: 'Tech',
      };
      const mockUserData = { sub: 1 };
      const mockPost = { id: 1, ...createPostDto };

      postsService.create = jest.fn().mockResolvedValue(mockPost);

      const result = await postsController.create(createPostDto, mockUserData);

      expect(postsService.create).toHaveBeenCalledWith(
        createPostDto,
        mockUserData.sub,
      );
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update new post', async () => {
      const postId = 1;
      const updatePostDto: any = {
        title: 'updated',
      };
      const mockUserData = { sub: 1 };
      const mockPost = { id: 1, ...updatePostDto };

      postsService.update = jest.fn().mockResolvedValue(mockPost);

      await postsController.update(postId, updatePostDto, mockUserData);

      expect(postsService.update).toHaveBeenCalledWith(
        postId,
        updatePostDto,
        mockUserData.sub,
      );
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const postId = 1;
      const mockUserData = { sub: 1 };

      postsService.delete = jest.fn().mockResolvedValue(undefined);

      await postsController.delete(postId, mockUserData);

      expect(postsService.delete).toHaveBeenCalledWith(
        postId,
        mockUserData.sub,
      );
    });
  });

  describe('addComment', () => {
    it('should create new comment on post', async () => {
      const postId = 1;
      const createCommentDto: any = {
        message: 'message',
      };
      const mockUserData = { sub: 1 };
      const mockPost = { id: 1, ...createCommentDto };

      postCommentService.addComment = jest.fn().mockResolvedValue(mockPost);

      await postsController.addComment(postId, createCommentDto, mockUserData);

      expect(postCommentService.addComment).toHaveBeenCalledWith(
        postId,
        createCommentDto,
        mockUserData.sub,
      );
    });
  });
});
