import type { LoginParams, TokenPair } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const authApi = {
  async refreshToken(refreshToken: string): Promise<TokenPair | undefined> {
    return await axiosInstance.post(getPath(ApiEndpoint.TOKEN_REFRESH), { value: refreshToken })
  },

  async login(params: LoginParams): Promise<TokenPair | undefined> {
    return await axiosInstance.post(getPath(ApiEndpoint.LOGIN), params)
  },

  async getIdentity(): Promise<TokenPair | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.IDENTITY))
  },
}
