import type { AxiosInstance } from 'axios'
import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.ts'
import { ApiEndpoint } from '@/api/endpoints.ts'

/**
 * The axios request config type.
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    requiresAuth?: boolean
  }

  interface InternalAxiosRequestConfig {
    requiresAuth?: boolean
  }
}

/**
 * Show error notification.
 * @param errorMessage - The error message.
 */
const showError = (errorMessage: string) => {
  ElNotification.closeAll()
  ElNotification.error(errorMessage)
}

/**
 * The axios instance.
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}${ApiEndpoint.BASE_API}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * The axios request interceptor.
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    const requiresAuth = config.requiresAuth === true
    if (requiresAuth) {
      const authStore = useAuthStore()
      const token = await authStore.getAccessToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

/**
 * The axios response interceptor.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // showError('Unauthorized')
          useAuthStore().logout()
          break
        case 403:
          showError('Forbidden')
          break
        case 404:
          showError('Not Found')
          break
        case 500:
          showError('Internal Server Error')
          break
        default:
          showError('Something went wrong')
      }
    } else if (error.request) {
      showError('Network Error')
    } else {
      showError('Something went wrong')
    }

    return null
  },
)

export default axiosInstance
