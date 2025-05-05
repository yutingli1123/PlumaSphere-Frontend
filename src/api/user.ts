import type { User } from '@/types'
import axiosInstance, { getResponseData } from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const userApi = {
  async getUserInfo(): Promise<User | undefined> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.USER_GET_ME))
    return getResponseData(response)
  },

  async getAllUsers(): Promise<User[] | undefined> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.USER_GET_ALL))
    return getResponseData(response)
  },
}
