import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest'
import { postApi } from '../post'
import axiosInstance from '@/utils/axios'
import type { Article, ArticleRequest, ArticleUpdateRequest } from '@/types'

// Mock axios instance
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

type MockAxios = {
  get: Mock
  post: Mock
  put: Mock
  delete: Mock
}

const mockAxios = axiosInstance as unknown as MockAxios

describe('postApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllPosts', () => {
    it('should fetch posts with correct page parameter', async () => {
      // Arrange
      const page = 1
      const mockPosts: Article[] = [
        {
          id: 1,
          title: 'Test Post',
          content: 'Test content',
          authorId: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          tags: [],
        },
      ]

      mockAxios.get.mockResolvedValue(mockPosts)

      // Act
      const result = await postApi.getAllPosts(page)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post?page=1')
      expect(result).toEqual(mockPosts)
    })

    it('should handle empty posts response', async () => {
      // Arrange
      mockAxios.get.mockResolvedValue([])

      // Act
      const result = await postApi.getAllPosts(1)

      // Assert
      expect(result).toEqual([])
    })
  })

  describe('getPostById', () => {
    it('should fetch post by id', async () => {
      // Arrange
      const postId = 123
      const mockPost: Article = {
        id: postId,
        title: 'Test Post',
        content: 'Test content',
        authorId: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      }

      mockAxios.get.mockResolvedValue(mockPost)

      // Act
      const result = await postApi.getPostById(postId)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/123')
      expect(result).toEqual(mockPost)
    })

    it('should handle string id parameter', async () => {
      // Arrange
      const postId = '456'
      mockAxios.get.mockResolvedValue(null)

      // Act
      await postApi.getPostById(postId)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/456')
    })
  })

  describe('createPost', () => {
    it('should create post successfully', async () => {
      // Arrange
      const newPost: ArticleRequest = {
        title: 'New Post',
        content: 'New content',
        tags: ['tag1', 'tag2'],
      }

      mockAxios.post.mockResolvedValue({ id: 123 })

      // Act
      const result = await postApi.createPost(newPost)

      // Assert
      expect(mockAxios.post).toHaveBeenCalledWith('/post', newPost, {
        requiresAuth: true,
      })
      expect(result).toBe(true)
    })

    it('should handle post creation failure', async () => {
      // Arrange
      const newPost: ArticleRequest = {
        title: 'New Post',
        content: 'New content',
        tags: [],
      }

      mockAxios.post.mockResolvedValue(null)

      // Act
      const result = await postApi.createPost(newPost)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('updatePost', () => {
    it('should update post successfully', async () => {
      // Arrange
      const updatePost: ArticleUpdateRequest = {
        id: '123',
        title: 'Updated Post',
        content: 'Updated content',
        tags: ['tag1'],
      }

      mockAxios.put.mockResolvedValue({ success: true })

      // Act
      const result = await postApi.updatePost(updatePost)

      // Assert
      expect(mockAxios.put).toHaveBeenCalledWith('/post', updatePost, {
        requiresAuth: true,
      })
      expect(result).toBe(true)
    })

    it('should handle post update failure', async () => {
      // Arrange
      const updatePost: ArticleUpdateRequest = {
        id: '123',
        title: 'Updated Post',
        content: 'Updated content',
        tags: [],
      }

      mockAxios.put.mockResolvedValue(null)

      // Act
      const result = await postApi.updatePost(updatePost)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getPostPages', () => {
    it('should fetch total page count', async () => {
      // Arrange
      const mockPageCount = 10
      mockAxios.get.mockResolvedValue(mockPageCount)

      // Act
      const result = await postApi.getPostPages()

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/count-page')
      expect(result).toBe(mockPageCount)
    })
  })

  describe('getPostCount', () => {
    it('should fetch total post count', async () => {
      // Arrange
      const mockCount = 100
      mockAxios.get.mockResolvedValue(mockCount)

      // Act
      const result = await postApi.getPostCount()

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/post/count')
      expect(result).toBe(mockCount)
    })
  })
})
