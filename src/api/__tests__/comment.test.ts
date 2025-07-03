import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { commentApi } from '../comment'
import axiosInstance from '@/utils/axios'
import type { Comment } from '@/types'
import { SortBy } from '@/constant'

// Mock axios instance
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

type MockAxios = {
  get: Mock
  post: Mock
  delete: Mock
}

const mockAxios = axiosInstance as unknown as MockAxios

describe('commentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getCommentsByPostId', () => {
    it('should fetch comments for a post with default sort', async () => {
      // Arrange
      const postId = 123
      const page = 1
      const mockComments: Comment[] = [
        {
          id: 1,
          content: 'Test comment',
          authorId: 1,
          authorNickname: 'Test User',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]

      mockAxios.get.mockResolvedValue(mockComments)

      // Act
      const result = await commentApi.getCommentsByPostId(postId, page)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/123/comment?page=1&sortBy=time')
      expect(result).toEqual(mockComments)
    })

    it('should fetch comments with custom sort order', async () => {
      // Arrange
      const postId = '456'
      const page = '2'
      const sortBy = SortBy.LIKE

      mockAxios.get.mockResolvedValue([])

      // Act
      await commentApi.getCommentsByPostId(postId, page, sortBy)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/456/comment?page=2&sortBy=like')
    })
  })

  describe('getCommentPagesByPostId', () => {
    it('should fetch comment page count for a post', async () => {
      // Arrange
      const postId = 123
      const mockPageCount = 5

      mockAxios.get.mockResolvedValue(mockPageCount)

      // Act
      const result = await commentApi.getCommentPagesByPostId(postId)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/123/comment/count-page')
      expect(result).toBe(mockPageCount)
    })
  })

  describe('getCommentCount', () => {
    it('should fetch total comment count for a post', async () => {
      // Arrange
      const postId = 123
      const mockCount = 25

      mockAxios.get.mockResolvedValue(mockCount)

      // Act
      const result = await commentApi.getCommentCount(postId)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/123/comment/count')
      expect(result).toBe(mockCount)
    })
  })

  describe('getCommentsByUserId', () => {
    it('should fetch comments by user with auth', async () => {
      // Arrange
      const userId = 123
      const page = 1
      const mockComments: Comment[] = [
        {
          id: 1,
          content: 'User comment',
          authorId: userId,
          authorNickname: 'Test User',
          createdAt: '2024-01-01T00:00:00Z',
        },
      ]

      mockAxios.get.mockResolvedValue(mockComments)

      // Act
      const result = await commentApi.getCommentsByUserId(userId, page)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/user/123/comment?page=1', {
        requiresAuth: true,
      })
      expect(result).toEqual(mockComments)
    })
  })
})
