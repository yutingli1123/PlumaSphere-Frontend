import type { LoginParams, TokenPair } from '@/types'
import axiosInstance, { getResponseData } from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const authApi = {
  async refreshToken(refreshToken: string): Promise<TokenPair | undefined> {
    const response = await axiosInstance.post(getPath(ApiEndpoint.TOKEN_REFRESH), refreshToken)
    return getResponseData(response)
  },

  async login(params: LoginParams): Promise<TokenPair | undefined> {
    const response = await axiosInstance.post(getPath(ApiEndpoint.LOGIN), params)
    return getResponseData(response)
  },
}
