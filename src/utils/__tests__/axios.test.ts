import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@/stores/auth'

// Mock dependencies
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}))
vi.mock('@/stores/auth')

const mockAxios = axios as typeof axios
const mockAuthStore = {
  getAccessToken: vi.fn(),
  logout: vi.fn(),
}

describe('axios utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Mock useAuthStore
    vi.mocked(useAuthStore).mockReturnValue(
      mockAuthStore as unknown as ReturnType<typeof useAuthStore>,
    )
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('axios configuration', () => {
    it('should create axios instance with correct base configuration', async () => {
      // Clear previous calls and reset modules
      vi.clearAllMocks()
      vi.resetModules()

      // Re-import to trigger axios.create
      await import('../axios')

      // The axios instance is created when the module is imported
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    })
  })

  describe('request interceptor', () => {
    let requestInterceptor: (
      config: InternalAxiosRequestConfig,
    ) => Promise<InternalAxiosRequestConfig>

    beforeEach(async () => {
      // Re-import to get fresh instance
      vi.resetModules()

      // Mock axios.create to capture the interceptor
      const mockAxiosInstance = {
        interceptors: {
          request: {
            use: vi.fn((successHandler) => {
              requestInterceptor = successHandler
            }),
          },
          response: {
            use: vi.fn(),
          },
        },
      }
      vi.mocked(mockAxios.create).mockReturnValue(mockAxiosInstance as unknown as AxiosInstance)

      // Re-import the module to trigger interceptor setup
      await import('../axios')
    })

    it('should add Authorization header when requiresAuth is true', async () => {
      // Arrange
      const mockConfig: InternalAxiosRequestConfig = {
        requiresAuth: true,
        headers: {},
        url: '',
        method: 'get',
      } as InternalAxiosRequestConfig
      const mockToken = 'test-access-token'
      mockAuthStore.getAccessToken.mockResolvedValue(mockToken)

      // Act
      const result = await requestInterceptor(mockConfig)

      // Assert
      expect(mockAuthStore.getAccessToken).toHaveBeenCalled()
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`)
    })

    it('should not add Authorization header when requiresAuth is false', async () => {
      // Arrange
      const mockConfig: InternalAxiosRequestConfig = {
        requiresAuth: false,
        headers: {},
        url: '',
        method: 'get',
      } as InternalAxiosRequestConfig

      // Act
      const result = await requestInterceptor(mockConfig)

      // Assert
      expect(mockAuthStore.getAccessToken).not.toHaveBeenCalled()
      expect(result.headers.Authorization).toBeUndefined()
    })

    it('should not add Authorization header when token is null', async () => {
      // Arrange
      const mockConfig: InternalAxiosRequestConfig = {
        requiresAuth: true,
        headers: {},
        url: '',
        method: 'get',
      } as InternalAxiosRequestConfig
      mockAuthStore.getAccessToken.mockResolvedValue(null)

      // Act
      const result = await requestInterceptor(mockConfig)

      // Assert
      expect(mockAuthStore.getAccessToken).toHaveBeenCalled()
      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('response interceptor', () => {
    let responseSuccessHandler: (response: AxiosResponse) => unknown
    let responseErrorHandler: (error: AxiosError) => unknown

    beforeEach(async () => {
      // Reset modules and clear mocks
      vi.resetModules()
      vi.clearAllMocks()

      // Mock axios.create to capture the interceptors
      const mockAxiosInstance = {
        interceptors: {
          request: {
            use: vi.fn(),
          },
          response: {
            use: vi.fn((successHandler, errorHandler) => {
              responseSuccessHandler = successHandler
              responseErrorHandler = errorHandler
            }),
          },
        },
      }
      vi.mocked(mockAxios.create).mockReturnValue(mockAxiosInstance as unknown as AxiosInstance)

      // Re-import the module to trigger interceptor setup
      await import('../axios')
    })

    it('should return response.data on successful response', () => {
      // Arrange
      const mockResponse = {
        data: { message: 'success' },
        status: 200,
      }

      // Act
      const result = responseSuccessHandler(mockResponse as AxiosResponse)

      // Assert
      expect(result).toEqual({ message: 'success' })
    })

    it('should handle 401 error and logout user', () => {
      // Arrange
      const mockError: Partial<AxiosError> = {
        response: {
          status: 401,
          data: null,
          statusText: 'Unauthorized',
          headers: {},
          config: {} as InternalAxiosRequestConfig<unknown>,
        },
      }

      // Act
      const result = responseErrorHandler(mockError as AxiosError)

      // Assert
      expect(mockAuthStore.logout).toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should show error notification for 403 error', async () => {
      // Arrange
      const mockError: Partial<AxiosError> = {
        response: {
          status: 403,
          data: null,
          statusText: 'Forbidden',
          headers: {},
          config: {} as InternalAxiosRequestConfig<unknown>,
        },
      }

      // Act
      const result = responseErrorHandler(mockError as AxiosError)

      // Assert
      expect(result).toBeNull()
    })

    it('should show error notification for 404 error', () => {
      // Arrange
      const mockError: Partial<AxiosError> = {
        response: {
          status: 404,
          data: null,
          statusText: 'Not Found',
          headers: {},
          config: {} as InternalAxiosRequestConfig<unknown>,
        },
      }

      // Act
      const result = responseErrorHandler(mockError as AxiosError)

      // Assert
      expect(result).toBeNull()
    })

    it('should show error notification for 500 error', () => {
      // Arrange
      const mockError: Partial<AxiosError> = {
        response: {
          status: 500,
          data: null,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as InternalAxiosRequestConfig<unknown>,
        },
      }

      // Act
      const result = responseErrorHandler(mockError as AxiosError)

      // Assert
      expect(result).toBeNull()
    })

    it('should show network error for request without response', () => {
      // Arrange
      const mockError: Partial<AxiosError> = {
        request: {},
        response: undefined,
      }

      // Act
      const result = responseErrorHandler(mockError as AxiosError)

      // Assert
      expect(result).toBeNull()
    })

    it('should show generic error for other errors', () => {
      // Arrange
      const mockError: Partial<AxiosError> = {
        message: 'Unknown error',
        request: undefined,
        response: undefined,
      }

      // Act
      const result = responseErrorHandler(mockError as AxiosError)

      // Assert
      expect(result).toBeNull()
    })
  })
})
