import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { userApi } from '../user'
import axiosInstance from '@/utils/axios'
import type { User, UserWithAdminInfo } from '@/types'

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

describe('userApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getSelfInfo', () => {
    it('should fetch current user info with auth', async () => {
      // Arrange
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        nickname: 'Test User',
        bio: 'Test bio',
        avatarUrl: '',
        avatarColor: '#ff0000',
        initials: 'TU',
        dob: '1990-01-01',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        lastLoginAt: '2024-01-01T00:00:00Z',
      }

      mockAxios.get.mockResolvedValue(mockUser)

      // Act
      const result = await userApi.getSelfInfo()

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/user/me', {
        requiresAuth: true,
      })
      expect(result).toEqual(mockUser)
    })

    it('should handle self info fetch failure', async () => {
      // Arrange
      mockAxios.get.mockResolvedValue(undefined)

      // Act
      const result = await userApi.getSelfInfo()

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('getAllUsers', () => {
    it('should fetch all users with pagination', async () => {
      // Arrange
      const page = 1
      const mockUsers: UserWithAdminInfo[] = [
        {
          id: 1,
          username: 'user1',
          nickname: 'User 1',
          bio: '',
          avatarUrl: '',
          avatarColor: '#ff0000',
          initials: 'U1',
          dob: '1990-01-01',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          lastLoginAt: '2024-01-01T00:00:00Z',
          isBanned: false,
          banReason: '',
          bannedAt: '',
          banExpiresAt: null,
          isPendingIpBan: false,
          ipBanReason: '',
          ipBanExpiresAt: null,
          isAdmin: false,
        },
      ]

      mockAxios.get.mockResolvedValue(mockUsers)

      // Act
      const result = await userApi.getAllUsers(page)

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/user?page=1', {
        requiresAuth: true,
      })
      expect(result).toEqual(mockUsers)
    })
  })

  describe('getAllUsersCount', () => {
    it('should fetch user count and pages', async () => {
      // Arrange
      const mockTotalPages = 5
      const mockTotalCount = 50

      mockAxios.get
        .mockResolvedValueOnce(mockTotalPages) // First call for page count
        .mockResolvedValueOnce(mockTotalCount) // Second call for total count

      // Act
      const result = await userApi.getAllUsersCount()

      // Assert
      expect(mockAxios.get).toHaveBeenNthCalledWith(1, '/user/count-page', {
        requiresAuth: true,
      })
      expect(mockAxios.get).toHaveBeenNthCalledWith(2, '/user/count', {
        requiresAuth: true,
      })
      expect(result).toEqual({
        totalCount: mockTotalCount,
        totalPages: mockTotalPages,
      })
    })
  })
})
