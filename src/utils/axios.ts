import type { AxiosInstance } from 'axios'
import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.ts'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const authStore = useAuthStore()
    const token = await authStore.getAccessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
          ElMessage.error('Unauthorized')
          break
        case 403:
          ElMessage.error('Forbidden')
          break
        case 404:
          ElMessage.error('Not Found')
          break
        case 500:
          ElMessage.error('Internal Server Error')
          break
        default:
          ElMessage.error('Something went wrong')
      }
    } else if (error.request) {
      ElMessage.error('Network Error')
    } else {
      ElMessage.error('Something went wrong')
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
