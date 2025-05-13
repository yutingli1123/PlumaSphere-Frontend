import type { AxiosInstance } from 'axios'
import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.ts'

declare module 'axios' {
  interface AxiosRequestConfig {
    requiresAuth?: boolean
  }

  interface InternalAxiosRequestConfig {
    requiresAuth?: boolean
  }
}

const showError = (errorMessage: string) => {
  ElNotification.closeAll()
  ElNotification.error(errorMessage)
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const requiresAuth = config.requiresAuth === true
    if (requiresAuth) {
      const authStore = useAuthStore()
      const token = await authStore.getAccessToken

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

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
