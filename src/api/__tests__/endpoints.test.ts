import { describe, expect, it } from 'vitest'
import { ApiEndpoint, getPath } from '../endpoints'

describe('endpoints', () => {
  describe('getPath function', () => {
    it('should return path without parameters', () => {
      const result = getPath(ApiEndpoint.LOGIN)
      expect(result).toBe('/login')
    })

    it('should replace single parameter', () => {
      const result = getPath(ApiEndpoint.POST_GET_BY_ID, { id: 123 })
      expect(result).toBe('/post/123')
    })

    it('should replace multiple parameters', () => {
      const result = getPath(ApiEndpoint.COMMENT_GET_ALL_BY_POST_ID, { postId: 456 })
      expect(result).toBe('/post/456/comment')
    })

    it('should handle string parameters', () => {
      const result = getPath(ApiEndpoint.POST_GET_BY_ID, { id: 'abc' })
      expect(result).toBe('/post/abc')
    })
  })
})
