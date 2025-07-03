import { describe, it, expect, vi, beforeEach } from 'vitest'
import { likeApi } from '../like'
import axiosInstance from '@/utils/axios'
import { ApiEndpoint, getPath } from '@/api/endpoints'

// Mock axios instance
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('likeApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getLikesByPostId', () => {
    it('should get likes count for a post by id', async () => {
      const mockLikeCount = 42
      const postId = 123
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeCount)

      const result = await likeApi.getLikesByPostId(postId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/post/123/like')
      expect(result).toBe(mockLikeCount)
    })

    it('should handle string postId', async () => {
      const mockLikeCount = 10
      const postId = '456'
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeCount)

      const result = await likeApi.getLikesByPostId(postId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/post/456/like')
      expect(result).toBe(mockLikeCount)
    })
  })

  describe('getLikesByCommentId', () => {
    it('should get likes count for a comment by id', async () => {
      const mockLikeCount = 15
      const commentId = 789
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeCount)

      const result = await likeApi.getLikesByCommentId(commentId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/comment/789/like')
      expect(result).toBe(mockLikeCount)
    })

    it('should handle string commentId', async () => {
      const mockLikeCount = 25
      const commentId = '101'
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeCount)

      const result = await likeApi.getLikesByCommentId(commentId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/comment/101/like')
      expect(result).toBe(mockLikeCount)
    })
  })

  describe('checkPostLikeState', () => {
    it('should check if user has liked a post', async () => {
      const mockLikeState = true
      const postId = 123
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeState)

      const result = await likeApi.checkPostLikeState(postId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/post/123/like/state', {
        requiresAuth: true,
      })
      expect(result).toBe(mockLikeState)
    })

    it('should return false when user has not liked the post', async () => {
      const mockLikeState = false
      const postId = '456'
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeState)

      const result = await likeApi.checkPostLikeState(postId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/post/456/like/state', {
        requiresAuth: true,
      })
      expect(result).toBe(mockLikeState)
    })
  })

  describe('checkCommentLikeState', () => {
    it('should check if user has liked a comment', async () => {
      const mockLikeState = true
      const commentId = 789
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeState)

      const result = await likeApi.checkCommentLikeState(commentId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/comment/789/like/state', {
        requiresAuth: true,
      })
      expect(result).toBe(mockLikeState)
    })

    it('should return false when user has not liked the comment', async () => {
      const mockLikeState = false
      const commentId = '101'
      vi.mocked(axiosInstance.get).mockResolvedValue(mockLikeState)

      const result = await likeApi.checkCommentLikeState(commentId)

      expect(axiosInstance.get).toHaveBeenCalledWith('/comment/101/like/state', {
        requiresAuth: true,
      })
      expect(result).toBe(mockLikeState)
    })
  })

  describe('likePost', () => {
    it('should like a post', async () => {
      const postId = 123
      vi.mocked(axiosInstance.post).mockResolvedValue(undefined)

      await likeApi.likePost(postId)

      expect(axiosInstance.post).toHaveBeenCalledWith('/post/123/like', null, {
        requiresAuth: true,
      })
    })

    it('should handle string postId', async () => {
      const postId = '456'
      vi.mocked(axiosInstance.post).mockResolvedValue(undefined)

      await likeApi.likePost(postId)

      expect(axiosInstance.post).toHaveBeenCalledWith('/post/456/like', null, {
        requiresAuth: true,
      })
    })
  })

  describe('likeComment', () => {
    it('should like a comment', async () => {
      const commentId = 789
      vi.mocked(axiosInstance.post).mockResolvedValue(undefined)

      await likeApi.likeComment(commentId)

      expect(axiosInstance.post).toHaveBeenCalledWith('/comment/789/like', null, {
        requiresAuth: true,
      })
    })

    it('should handle string commentId', async () => {
      const commentId = '101'
      vi.mocked(axiosInstance.post).mockResolvedValue(undefined)

      await likeApi.likeComment(commentId)

      expect(axiosInstance.post).toHaveBeenCalledWith('/comment/101/like', null, {
        requiresAuth: true,
      })
    })
  })
})
