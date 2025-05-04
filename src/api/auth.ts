import type { LoginParams, TokenPair } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const authApi = {
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const response = await axiosInstance.post(getPath(ApiEndpoint.TOKEN_REFRESH), refreshToken)
    return JSON.parse(response.data)
  },

  async login(params: LoginParams): Promise<TokenPair> {
    const response = await axiosInstance.post(getPath(ApiEndpoint.LOGIN), params)
    return JSON.parse(response.data)
  },
}
