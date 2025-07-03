import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest'
import { authApi } from '../auth'
import axiosInstance from '@/utils/axios'
import type { LoginParams, TokenPair } from '@/types'

// Mock axios instance
vi.mock('@/utils/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

type MockAxios = {
  post: Mock
  get: Mock
}

const mockAxios = axiosInstance as unknown as MockAxios

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call axios.post with correct parameters', async () => {
      // Arrange
      const loginParams: LoginParams = {
        username: 'testuser',
        password: 'password123',
      }
      const mockTokenPair: TokenPair = {
        accessToken: {
          token: 'access-token',
          expiresAt: '2026-12-31T23:59:59Z',
        },
        refreshToken: {
          token: 'refresh-token',
          expiresAt: '2027-01-31T23:59:59Z',
        },
      }

      mockAxios.post.mockResolvedValue(mockTokenPair)

      // Act
      const result = await authApi.login(loginParams)

      // Assert
      expect(mockAxios.post).toHaveBeenCalledWith('/login', loginParams)
      expect(result).toEqual(mockTokenPair)
    })

    it('should handle login failure', async () => {
      // Arrange
      const loginParams: LoginParams = {
        username: 'invaliduser',
        password: 'wrongpassword',
      }

      mockAxios.post.mockResolvedValue(undefined)

      // Act
      const result = await authApi.login(loginParams)

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('refreshToken', () => {
    it('should call axios.post with refresh token', async () => {
      // Arrange
      const refreshToken = 'refresh-token-123'
      const mockTokenPair: TokenPair = {
        accessToken: {
          token: 'new-access-token',
          expiresAt: '2026-12-31T23:59:59Z',
        },
        refreshToken: {
          token: 'new-refresh-token',
          expiresAt: '2027-01-31T23:59:59Z',
        },
      }

      mockAxios.post.mockResolvedValue(mockTokenPair)

      // Act
      const result = await authApi.refreshToken(refreshToken)

      // Assert
      expect(mockAxios.post).toHaveBeenCalledWith('/refresh-token', { value: refreshToken })
      expect(result).toEqual(mockTokenPair)
    })

    it('should handle refresh token failure', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token'
      mockAxios.post.mockResolvedValue(undefined)

      // Act
      const result = await authApi.refreshToken(refreshToken)

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('getIdentity', () => {
    it('should call axios.get to get user identity', async () => {
      // Arrange
      const mockIdentity: TokenPair = {
        accessToken: {
          token: 'current-access-token',
          expiresAt: '2026-12-31T23:59:59Z',
        },
        refreshToken: {
          token: 'current-refresh-token',
          expiresAt: '2027-01-31T23:59:59Z',
        },
      }

      mockAxios.get.mockResolvedValue(mockIdentity)

      // Act
      const result = await authApi.getIdentity()

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/get-identity')
      expect(result).toEqual(mockIdentity)
    })

    it('should handle identity fetch failure', async () => {
      // Arrange
      mockAxios.get.mockResolvedValue(undefined)

      // Act
      const result = await authApi.getIdentity()

      // Assert
      expect(result).toBeUndefined()
    })
  })
})
