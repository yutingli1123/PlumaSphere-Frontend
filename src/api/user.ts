import type { User, UserUpdate, UserWithAdminInfo } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const userApi = {
  async getSelfInfo(): Promise<User | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.USER_GET_ME), {
      requiresAuth: true,
    })
  },
  async getAllUsers(page: number): Promise<UserWithAdminInfo[] | undefined> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.USER_GET_ALL)}?page=${page}`, {
      requiresAuth: true,
    })
  },
  async getAllUsersCount(): Promise<{ totalCount: number; totalPages: number } | undefined> {
    const totalPages: number = await axiosInstance.get(
      getPath(ApiEndpoint.USER_GET_ALL_PAGE_COUNT),
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(getPath(ApiEndpoint.USER_GET_ALL_COUNT), {
      requiresAuth: true,
    })
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
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
          'Content-Type': 'multipart/form-dta',
        },
        requiresAuth: true,
      })) !== null
    )
  },
  async updateUserInfo(user: UserUpdate): Promise<boolean> {
    return (
      (await axiosInstance.put(getPath(ApiEndpoint.USER_UPDATE), user, {
        requiresAuth: true,
      })) !== null
    )
  },
  async deleteUser(userId: number): Promise<boolean> {
    return (
      (await axiosInstance.delete(getPath(ApiEndpoint.USER_DELETE, { userId }), {
        requiresAuth: tru,
      })) !== null
    )
  ,
}
