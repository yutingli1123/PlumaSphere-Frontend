import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest'
import { systemApi } from '../system'
import axiosInstance from '@/utils/axios'
import type { Config, InitSystemParams } from '@/types'

// Mock axios instance
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

type MockAxios = {
  get: Mock
  post: Mock
}

const mockAxios = axiosInstance as unknown as MockAxios

describe('systemApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getStatus', () => {
    it('should fetch system status config', async () => {
      // Arrange
      const mockConfig: Config[] = [
        { configKey: 'blogTitle', configValue: 'My Blog' },
        { configKey: 'blogSubtitle', configValue: 'A great blog' },
      ]

      mockAxios.get.mockResolvedValue(mockConfig)

      // Act
      const result = await systemApi.getStatus()

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/status')
      expect(result).toEqual(mockConfig)
    })

    it('should handle status fetch failure', async () => {
      // Arrange
      mockAxios.get.mockResolvedValue(undefined)

      // Act
      const result = await systemApi.getStatus()

      // Assert
      expect(result).toBeUndefined()
    })
  })

  describe('initSystem', () => {
    it('should initialize system with correct parameters', async () => {
      // Arrange
      const initParams: InitSystemParams = {
        verificationCode: 'ABC123',
        blogTitle: 'My New Blog',
        blogSubtitle: 'A fantastic blog',
        adminUsername: 'admin',
        adminPassword: 'password123',
        adminNickname: 'Administrator',
      }

      mockAxios.post.mockResolvedValue({})

      // Act
      await systemApi.initSystem(initParams)

      // Assert
      expect(mockAxios.post).toHaveBeenCalledWith('/init', initParams)
    })
  })

  describe('verifySystemInitCode', () => {
    it('should verify init code successfully', async () => {
      // Arrange
      const code = 'VALID123'
      mockAxios.post.mockResolvedValue(true)

      // Act
      const result = await systemApi.verifySystemInitCode(code)

      // Assert
      expect(mockAxios.post).toHaveBeenCalledWith('/init/verify-code', { value: code })
      expect(result).toBe(true)
    })

    it('should return false for invalid code', async () => {
      // Arrange
      const code = 'INVALID'
      mockAxios.post.mockResolvedValue(false)

      // Act
      const result = await systemApi.verifySystemInitCode(code)

      // Assert
      expect(result).toBe(false)
    })
  })

  describe('getStatusVersion', () => {
    it('should fetch system version', async () => {
      // Arrange
      const mockVersion = '1.2.3'
      mockAxios.get.mockResolvedValue(mockVersion)

      // Act
      const result = await systemApi.getStatusVersion()

      // Assert
      expect(mockAxios.get).toHaveBeenCalledWith('/status/version')
      expect(result).toBe(mockVersion)
    })
  })

  describe('updateSettings', () => {
    it('should update system settings with auth', async () => {
      // Arrange
      const settings: Config[] = [
        { configKey: 'blogTitle', configValue: 'Updated Blog Title' },
        { configKey: 'allowComments', configValue: 'true' },
      ]

      mockAxios.post.mockResolvedValue({})

      // Act
      await systemApi.updateSettings(settings)

      // Assert
      expect(mockAxios.post).toHaveBeenCalledWith('/settings', settings, {
        requiresAuth: true,
      })
    })
  })
})
