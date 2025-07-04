import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useConfigStore } from '../config'
import { systemApi } from '@/api/system'
import { ConfigFiled } from '@/constant'
import type { Config } from '@/types'

// Mock dependencies
vi.mock('@/api/system')

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

const mockSystemApi = vi.mocked(systemApi)

describe('useConfigStore', () => {
  let configStore: ReturnType<typeof useConfigStore>

  const mockConfig: Config[] = [
    { configKey: 'blog_title', configValue: 'My Blog' },
    { configKey: 'blog_subtitle', configValue: 'A great blog' },
    { configKey: 'page_size', configValue: '10' },
  ]

  const mockVersion = '1.0.0'

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    configStore = useConfigStore()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initialConfig', () => {
    it('should load config from localStorage when version matches', async () => {
      // Arrange
      const cachedConfig = [
        ...mockConfig,
        { configKey: 'config_version', configValue: mockVersion },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(cachedConfig))
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)

      // Act
      await configStore.initialConfig()

      // Assert
      expect(mockSystemApi.getStatusVersion).toHaveBeenCalled()
      expect(mockSystemApi.getStatus).not.toHaveBeenCalled()
      expect(configStore.loaded).toBe(true)
    })

    it('should fetch fresh config when no cached config exists', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)
      mockSystemApi.getStatus.mockResolvedValue(mockConfig)

      // Act
      await configStore.initialConfig()

      // Assert
      expect(mockSystemApi.getStatus).toHaveBeenCalled()
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'config',
        JSON.stringify([...mockConfig, { configKey: 'config_version', configValue: mockVersion }]),
      )
      expect(configStore.loaded).toBe(true)
    })

    it('should fetch fresh config when version mismatch', async () => {
      // Arrange
      const oldConfig = [...mockConfig, { configKey: 'config_version', configValue: '0.9.0' }]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(oldConfig))
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)
      mockSystemApi.getStatus.mockResolvedValue(mockConfig)

      // Act
      await configStore.initialConfig()

      // Assert
      expect(mockSystemApi.getStatus).toHaveBeenCalled()
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should only initialize once on multiple calls', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)
      mockSystemApi.getStatus.mockResolvedValue(mockConfig)

      // Act - call multiple times
      const promise1 = configStore.initialConfig()
      const promise2 = configStore.initialConfig()
      const promise3 = configStore.initialConfig()

      await Promise.all([promise1, promise2, promise3])

      // Assert - should only call API once
      expect(mockSystemApi.getStatus).toHaveBeenCalledTimes(1)
      expect(mockSystemApi.getStatusVersion).toHaveBeenCalledTimes(1)
    })
  })

  describe('getConfig', () => {
    it('should return config value for existing key', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)
      mockSystemApi.getStatus.mockResolvedValue(mockConfig)
      await configStore.initialConfig()

      // Act
      const result = configStore.getConfig(ConfigFiled.BLOG_TITLE)

      // Assert
      expect(result).toBe('My Blog')
    })

    it('should return null for non-existing key', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)
      mockSystemApi.getStatus.mockResolvedValue(mockConfig)
      await configStore.initialConfig()

      // Act
      const result = configStore.getConfig(ConfigFiled.INITIALIZED)

      // Assert
      expect(result).toBeNull()
    })

    it('should return null when config is not loaded', () => {
      // Act
      const result = configStore.getConfig(ConfigFiled.BLOG_TITLE)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('resetConfig', () => {
    it('should clear config and localStorage', async () => {
      // Arrange - first initialize config
      localStorageMock.getItem.mockReturnValue(null)
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)
      mockSystemApi.getStatus.mockResolvedValue(mockConfig)
      await configStore.initialConfig()
      expect(configStore.loaded).toBe(true)

      // Act
      configStore.resetConfig()

      // Assert
      expect(configStore.loaded).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('config')
    })
  })

  describe('refreshConfig', () => {
    it('should fetch fresh config and update localStorage', async () => {
      // Arrange
      const newConfig: Config[] = [
        { configKey: 'blog_title', configValue: 'Updated Blog' },
        { configKey: 'blog_subtitle', configValue: 'Updated subtitle' },
      ]
      mockSystemApi.getStatus.mockResolvedValue(newConfig)
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)

      // Act
      await configStore.refreshConfig()

      // Assert
      expect(mockSystemApi.getStatus).toHaveBeenCalled()
      expect(mockSystemApi.getStatusVersion).toHaveBeenCalled()
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'config',
        JSON.stringify([...newConfig, { configKey: 'config_version', configValue: mockVersion }]),
      )
    })
  })

  describe('loaded computed', () => {
    it('should return false initially', () => {
      expect(configStore.loaded).toBe(false)
    })

    it('should return true after config is loaded', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)
      mockSystemApi.getStatusVersion.mockResolvedValue(mockVersion)
      mockSystemApi.getStatus.mockResolvedValue(mockConfig)

      // Act
      await configStore.initialConfig()

      // Assert
      expect(configStore.loaded).toBe(true)
    })
  })
})
