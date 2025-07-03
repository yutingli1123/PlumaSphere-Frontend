import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'
import { useAuthStore } from '../auth'
import { userApi } from '@/api/user'
import type { User } from '@/types'

// Mock dependencies
vi.mock('@/api/user')
vi.mock('../auth')

const mockUserApi = vi.mocked(userApi)
const mockAuthStore = {
  hasToken: vi.fn(),
}

describe('useUserStore', () => {
  let userStore: ReturnType<typeof useUserStore>

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    nickname: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    avatarColor: '#ff0000',
    initials: 'TU',
    dob: '1990-01-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Mock useAuthStore
    vi.mocked(useAuthStore).mockReturnValue(
      mockAuthStore as unknown as ReturnType<typeof useAuthStore>,
    )

    userStore = useUserStore()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getUserInfo', () => {
    it('should return cached user info if available', async () => {
      // Arrange - set user info by first calling fetchUserInfo
      mockAuthStore.hasToken.mockReturnValue(true)
      mockUserApi.getSelfInfo.mockResolvedValue(mockUser)
      await userStore.fetchUserInfo() // This will cache the user info

      // Act
      const result = await userStore.getUserInfo()

      // Assert
      expect(result).toEqual(mockUser)
      // getSelfInfo should have been called only once (during fetchUserInfo)
      expect(mockUserApi.getSelfInfo).toHaveBeenCalledTimes(1)
    })

    it('should fetch user info when not cached', async () => {
      // Arrange
      mockAuthStore.hasToken.mockReturnValue(true)
      mockUserApi.getSelfInfo.mockResolvedValue(mockUser)

      // Act
      const result = await userStore.getUserInfo()

      // Assert
      expect(mockAuthStore.hasToken).toHaveBeenCalled()
      expect(mockUserApi.getSelfInfo).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
      expect(userStore.user).toEqual(mockUser)
    })
  })

  describe('fetchUserInfo', () => {
    it('should fetch user info successfully when authenticated', async () => {
      // Arrange
      mockAuthStore.hasToken.mockReturnValue(true)
      mockUserApi.getSelfInfo.mockResolvedValue(mockUser)

      // Act
      const result = await userStore.fetchUserInfo()

      // Assert
      expect(mockAuthStore.hasToken).toHaveBeenCalled()
      expect(mockUserApi.getSelfInfo).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
      expect(userStore.user).toEqual(mockUser)
    })

    it('should return null when not authenticated', async () => {
      // Arrange
      mockAuthStore.hasToken.mockReturnValue(false)

      // Act
      const result = await userStore.fetchUserInfo()

      // Assert
      expect(mockAuthStore.hasToken).toHaveBeenCalled()
      expect(mockUserApi.getSelfInfo).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should return null when API call fails', async () => {
      // Arrange
      mockAuthStore.hasToken.mockReturnValue(true)
      mockUserApi.getSelfInfo.mockResolvedValue(undefined)

      // Act
      const result = await userStore.fetchUserInfo()

      // Assert
      expect(result).toBeNull()
    })

    it('should handle API errors gracefully', async () => {
      // Arrange
      mockAuthStore.hasToken.mockReturnValue(true)
      mockUserApi.getSelfInfo.mockRejectedValue(new Error('API Error'))

      // Act
      const result = await userStore.fetchUserInfo()

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('clearUserInfo', () => {
    it('should clear user info', async () => {
      // Arrange - set user info first
      mockAuthStore.hasToken.mockReturnValue(true)
      mockUserApi.getSelfInfo.mockResolvedValue(mockUser)
      await userStore.fetchUserInfo()
      expect(userStore.user).toEqual(mockUser)

      // Act
      userStore.clearUserInfo()

      // Assert
      expect(userStore.user).toBeNull()
    })
  })

  describe('user computed', () => {
    it('should return null initially', () => {
      // Act & Assert
      expect(userStore.user).toBeNull()
    })

    it('should return user info after fetching', async () => {
      // Arrange
      mockAuthStore.hasToken.mockReturnValue(true)
      mockUserApi.getSelfInfo.mockResolvedValue(mockUser)

      // Act
      await userStore.fetchUserInfo()

      // Assert
      expect(userStore.user).toEqual(mockUser)
    })
  })
})
