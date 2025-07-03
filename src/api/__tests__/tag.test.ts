import { describe, it, expect, vi, beforeEach } from 'vitest'
import { tagApi } from '../tag'
import axiosInstance from '@/utils/axios'
import { ApiEndpoint, getPath } from '@/api/endpoints'
import type { Tag } from '@/types'

// Mock axios instance
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('tagApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllTags', () => {
    it('should get all tags successfully', async () => {
      const mockTags: Tag[] = [
        { id: 1, name: 'Vue', postCount: 10 },
        { id: 2, name: 'TypeScript', postCount: 8 },
        { id: 3, name: 'JavaScript', postCount: 15 },
      ]
      vi.mocked(axiosInstance.get).mockResolvedValue(mockTags)

      const result = await tagApi.getAllTags()

      expect(axiosInstance.get).toHaveBeenCalledWith('/tag')
      expect(result).toEqual(mockTags)
    })

    it('should return undefined when request fails', async () => {
      vi.mocked(axiosInstance.get).mockResolvedValue(undefined)

      const result = await tagApi.getAllTags()

      expect(axiosInstance.get).toHaveBeenCalledWith('/tag')
      expect(result).toBeUndefined()
    })

    it('should handle empty tags array', async () => {
      const mockTags: Tag[] = []
      vi.mocked(axiosInstance.get).mockResolvedValue(mockTags)

      const result = await tagApi.getAllTags()

      expect(axiosInstance.get).toHaveBeenCalledWith('/tag')
      expect(result).toEqual([])
    })
  })

  describe('addTag', () => {
    it('should add a new tag successfully', async () => {
      const newTag: Tag = { id: 4, name: 'React', postCount: 0 }
      vi.mocked(axiosInstance.post).mockResolvedValue(undefined)

      await tagApi.addTag(newTag)

      expect(axiosInstance.post).toHaveBeenCalledWith('/tag', newTag, {
        requiresAuth: true,
      })
    })

    it('should add tag with minimal data', async () => {
      const newTag: Tag = { id: 5, name: 'Angular' }
      vi.mocked(axiosInstance.post).mockResolvedValue(undefined)

      await tagApi.addTag(newTag)

      expect(axiosInstance.post).toHaveBeenCalledWith('/tag', newTag, {
        requiresAuth: true,
      })
    })

    it('should require authentication for adding tags', async () => {
      const newTag: Tag = { id: 6, name: 'Svelte', postCount: 2 }
      vi.mocked(axiosInstance.post).mockResolvedValue(undefined)

      await tagApi.addTag(newTag)

      expect(axiosInstance.post).toHaveBeenCalledWith('/tag', newTag, {
        requiresAuth: true,
      })
    })
  })
})
