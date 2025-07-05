import type { LoginParams, TokenPair } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

/**
 * The authentication API.
 */
export const authApi = {
  /**
   * Refresh a token.
   * @param refreshToken - The refresh token to refresh.
   * @returns The response from the API.
   */
  async refreshToken(refreshToken: string): Promise<TokenPair | undefined> {
    return await axiosInstance.post(getPath(ApiEndpoint.TOKEN_REFRESH), { value: refreshToken })
  },

  /**
   * Login.
   * @param params - The login parameters.
   * @returns The response from the API.
   */
  async login(params: LoginParams): Promise<TokenPair | undefined> {
    return await axiosInstance.post(getPath(ApiEndpoint.LOGIN), params)
  },

  /**
   * Get the anonymous identity.
   * @returns The response from the API.
   */
  async getIdentity(): Promise<TokenPair | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.IDENTITY))
  },
}
