import type { TokenPair } from '@/types'
import axiosInstance from '@/utils/axios.ts'

export const authApi = {
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const response = await axiosInstance.post('/refresh_token', { refreshToken })
    return JSON.parse(response.data)
  },
}
