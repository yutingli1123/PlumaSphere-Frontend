import type { LoginParams, TokenPair, User } from '@/types'
import axiosInstance from '@/utils/axios.ts'

export const userApi = {
  async login(params: LoginParams): Promise<TokenPair> {
    const response = await axiosInstance.post('/login', params)
    return JSON.parse(response.data)
  },

  async getUserInfo(): Promise<User> {
    const response = await axiosInstance.get('/user/me')
    return JSON.parse(response.data)
  },
}
