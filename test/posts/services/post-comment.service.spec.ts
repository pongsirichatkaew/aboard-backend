import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostComment } from 'src/posts/entities/post-comment.entity';
import { PostCommentService } from 'src/posts/services/post-comment.service';
import { PostsService } from 'src/posts/services/posts.service';
import { Repository } from 'typeorm';

describe('PostCommentService', () => {
  let postCommentService: PostCommentService;
  let postService: PostsService;
  let commentRepository: Repository<PostComment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCommentService,
        { provide: PostsService, useValue: { findOne: jest.fn() } },
        {
          provide: getRepositoryToken(PostComment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    postCommentService = module.get<PostCommentService>(PostCommentService);
    postService = module.get<PostsService>(PostsService);
    commentRepository = module.get<Repository<PostComment>>(
      getRepositoryToken(PostComment),
    );
  });

  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      const postId = 1;
      const userId = 1;
      const mockComment = { message: 'test' };
      const createCommentDto: any = {
        message: 'This is a test comment',
      };

      postService.findOne = jest.fn().mockResolvedValue({ id: 1 });
      commentRepository.create = jest.fn().mockReturnValue(mockComment);
      commentRepository.save = jest.fn().mockResolvedValue(mockComment);

      await postCommentService.addComment(postId, createCommentDto, userId);

      expect(postService.findOne).toHaveBeenCalledWith(postId);

      expect(commentRepository.save).toHaveBeenCalledWith(mockComment);
    });
  });
});
