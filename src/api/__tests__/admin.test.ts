import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { adminApi } from '../admin'
import axiosInstance from '@/utils/axios'
import { ApiEndpoint } from '@/api/endpoints'
import type { BanIpRequest, BannedIp, BanRequest, UserWithAdminInfo } from '@/types'

// Mock axios instance
vi.mock('@/utils/axios', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}))

type MockAxios = {
  post: Mock
  get: Mock
  delete: Mock
}

const mockAxios = axiosInstance as unknown as MockAxios

describe('adminApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('banUser', () => {
    it('should ban a user successfully', async () => {
      const banRequest: BanRequest = {
        userId: 1,
        reason: 'Spam',
        expiresAt: '2025-07-01T00:00:00Z',
      }
      const mockResponse = 'User banned successfully'

      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await adminApi.banUser(banRequest)

      expect(mockAxios.post).toHaveBeenCalledWith(ApiEndpoint.BAN_USER, banRequest, {
        requiresAuth: true,
      })
      expect(result).toBe(mockResponse)
    })
  })

  describe('unbanUser', () => {
    it('should unban a user successfully', async () => {
      const userId = 1
      const mockResponse = 'User unbanned successfully'

      mockAxios.delete.mockResolvedValue(mockResponse)

      const result = await adminApi.unbanUser(userId)

      expect(mockAxios.delete).toHaveBeenCalledWith(`/admin/unban-user?id=${userId}`, {
        requiresAuth: true,
      })
      expect(result).toBe(mockResponse)
    })
  })

  describe('banIPForUser', () => {
    it('should ban IP for user successfully', async () => {
      const banRequest: BanRequest = {
        userId: 1,
        reason: 'Malicious activity',
      }
      const mockResponse = 'IP ban marked for user'

      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await adminApi.banIPForUser(banRequest)

      expect(mockAxios.post).toHaveBeenCalledWith(ApiEndpoint.BAN_IP_BY_USER_ID, banRequest, {
        requiresAuth: true,
      })
      expect(result).toBe(mockResponse)
    })
  })

  describe('unbanIPForUser', () => {
    it('should unban IP for user successfully', async () => {
      const userId = 1
      const mockResponse = 'IP unban marked for user'

      mockAxios.delete.mockResolvedValue(mockResponse)

      const result = await adminApi.unbanIPForUser(userId)

      expect(mockAxios.delete).toHaveBeenCalledWith(`/admin/unmark-user-ip-ban?id=${userId}`, {
        requiresAuth: true,
      })
      expect(result).toBe(mockResponse)
    })
  })

  describe('getBannedUsers', () => {
    it('should get banned users successfully', async () => {
      const page = 0
      const mockUsers: UserWithAdminInfo[] = [
        {
          id: 1,
          username: 'banneduser',
          nickname: 'Banned User',
          bio: 'Bio',
          avatarUrl: '',
          avatarColor: '#000000',
          initials: 'BU',
          dob: '1990-01-01',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
          lastLoginAt: '2025-01-01T00:00:00Z',
          isBanned: true,
          banReason: 'Spam',
          bannedAt: '2025-06-30T00:00:00Z',
          banExpiresAt: '2025-07-30T00:00:00Z',
          isPendingIpBan: false,
          ipBanReason: '',
          ipBanExpiresAt: null,
          isAdmin: false,
        },
      ]

      mockAxios.get.mockResolvedValue(mockUsers)

      const result = await adminApi.getBannedUsers(page)

      expect(mockAxios.get).toHaveBeenCalledWith(`/admin/banned-users?page=${page}`, {
        requiresAuth: true,
      })
      expect(result).toEqual(mockUsers)
    })
  })

  describe('getBannedUsersCount', () => {
    it('should get banned users count successfully', async () => {
      const mockTotalPages = 5
      const mockTotalCount = 50

      mockAxios.get.mockResolvedValueOnce(mockTotalPages).mockResolvedValueOnce(mockTotalCount)

      const result = await adminApi.getBannedUsersCount()

      expect(mockAxios.get).toHaveBeenCalledWith(ApiEndpoint.GET_BANNED_USERS_PAGE_COUNT, {
        requiresAuth: true,
      })
      expect(mockAxios.get).toHaveBeenCalledWith(ApiEndpoint.GET_BANNED_USERS_COUNT, {
        requiresAuth: true,
      })
      expect(result).toEqual({
        totalCount: mockTotalCount,
        totalPages: mockTotalPages,
      })
    })
  })

  describe('getBannedIps', () => {
    it('should get banned IPs successfully', async () => {
      const page = 0
      const mockBannedIps: BannedIp[] = [
        {
          id: 1,
          ipAddress: '192.168.1.1',
          reason: 'Malicious activity',
          bannedAt: '2025-06-30T00:00:00Z',
          expiresAt: '2025-07-30T00:00:00Z',
        },
      ]

      mockAxios.get.mockResolvedValue(mockBannedIps)

      const result = await adminApi.getBannedIps(page)

      expect(mockAxios.get).toHaveBeenCalledWith(`/admin/banned-ips?page=${page}`, {
        requiresAuth: true,
      })
      expect(result).toEqual(mockBannedIps)
    })
  })

  describe('getBannedIpsCount', () => {
    it('should get banned IPs count successfully', async () => {
      const mockTotalPages = 3
      const mockTotalCount = 25

      mockAxios.get.mockResolvedValueOnce(mockTotalPages).mockResolvedValueOnce(mockTotalCount)

      const result = await adminApi.getBannedIpsCount()

      expect(mockAxios.get).toHaveBeenCalledWith(ApiEndpoint.GET_BANNED_IPS_PAGE_COUNT, {
        requiresAuth: true,
      })
      expect(mockAxios.get).toHaveBeenCalledWith(ApiEndpoint.GET_BANNED_IPS_COUNT, {
        requiresAuth: true,
      })
      expect(result).toEqual({
        totalCount: mockTotalCount,
        totalPages: mockTotalPages,
      })
    })
  })

  describe('getMarkedUsers', () => {
    it('should get marked users successfully', async () => {
      const page = 0
      const mockMarkedUsers: UserWithAdminInfo[] = [
        {
          id: 2,
          username: 'markeduser',
          nickname: 'Marked User',
          bio: 'Bio',
          avatarUrl: '',
          avatarColor: '#000000',
          initials: 'MU',
          dob: '1990-01-01',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
          lastLoginAt: '2025-01-01T00:00:00Z',
          isBanned: false,
          banReason: '',
          bannedAt: '',
          banExpiresAt: null,
          isPendingIpBan: true,
          ipBanReason: 'Suspicious activity',
          ipBanExpiresAt: '2025-07-30T00:00:00Z',
          isAdmin: false,
        },
      ]

      mockAxios.get.mockResolvedValue(mockMarkedUsers)

      const result = await adminApi.getMarkedUsers(page)

      expect(mockAxios.get).toHaveBeenCalledWith(`/admin/marked-users?page=${page}`, {
        requiresAuth: true,
      })
      expect(result).toEqual(mockMarkedUsers)
    })
  })

  describe('getMarkedUsersCount', () => {
    it('should get marked users count successfully', async () => {
      const mockTotalPages = 2
      const mockTotalCount = 15

      mockAxios.get.mockResolvedValueOnce(mockTotalPages).mockResolvedValueOnce(mockTotalCount)

      const result = await adminApi.getMarkedUsersCount()

      expect(mockAxios.get).toHaveBeenCalledWith(ApiEndpoint.GET_MARKED_USERS_PAGE_COUNT, {
        requiresAuth: true,
      })
      expect(mockAxios.get).toHaveBeenCalledWith(ApiEndpoint.GET_MARKED_USERS_COUNT, {
        requiresAuth: true,
      })
      expect(result).toEqual({
        totalCount: mockTotalCount,
        totalPages: mockTotalPages,
      })
    })
  })

  describe('banIp', () => {
    it('should ban IP successfully', async () => {
      const banRequest: BanIpRequest = {
        ipAddress: '192.168.1.1',
        reason: 'Malicious activity',
        expiresAt: '2025-07-01T00:00:00Z',
      }
      const mockResponse = 'IP banned successfully'

      mockAxios.post.mockResolvedValue(mockResponse)

      const result = await adminApi.banIp(banRequest)

      expect(mockAxios.post).toHaveBeenCalledWith(ApiEndpoint.BAN_IP, banRequest, {
        requiresAuth: true,
      })
      expect(result).toBe(mockResponse)
    })
  })

  describe('unbanIp', () => {
    it('should unban IP successfully', async () => {
      const ipAddress = '192.168.1.1'
      const mockResponse = 'IP unbanned'

      mockAxios.delete.mockResolvedValue(mockResponse)

      const result = await adminApi.unbanIp(ipAddress)

      expect(mockAxios.delete).toHaveBeenCalledWith(`/admin/unban-ip?ipAddress=${ipAddress}`, {
        requiresAuth: true,
      })
      expect(result).toBe(true)
    })

    it('should return false when unban IP fails', async () => {
      const ipAddress = '192.168.1.1'

      mockAxios.delete.mockResolvedValue(null)

      const result = await adminApi.unbanIp(ipAddress)

      expect(result).toBe(false)
    })
  })
})
