import type { User } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const userApi = {
  async getUserInfo(): Promise<User | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.USER_GET_ME), {
      requiresAuth: true,
    })
  },
  async getAllUsers(): Promise<User[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.USER_GET_ALL))
  },
  async getUserById(userId: number): Promise<User | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.USER_GET_BY_ID, { userId }))
  },
}
