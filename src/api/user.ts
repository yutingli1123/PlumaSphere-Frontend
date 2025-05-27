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
  async updateAvatar(avatar: File): Promise<boolean> {
    const formData = new FormData()
    formData.append('file', avatar)

    return (
      (await axiosInstance.put(getPath(ApiEndpoint.USER_UPLOAD_AVATAR), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        requiresAuth: true,
      })) !== null
    )
  },
}
