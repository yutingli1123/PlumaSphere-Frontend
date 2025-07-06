import type { User, UserUpdate, UserWithAdminInfo } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

/**
 * The user API.
 */
export const userApi = {
  /**
   * Get the self info.
   * @returns The self info.
   */
  async getSelfInfo(): Promise<User | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.USER_GET_ME), {
      requiresAuth: true,
    })
  },
  /**
   * Get all users.
   * @param page - The page number to get.
   * @returns The users.
   */
  async getAllUsers(page: number): Promise<UserWithAdminInfo[] | undefined> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.USER_GET_ALL)}?page=${page}`, {
      requiresAuth: true,
    })
  },
  /**
   * Get the count and total pages of all users.
   * @returns The count and total pages of all users.
   */
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
  /**
   * Get a user by ID.
   * @param userId - The ID of the user to get.
   * @returns The user.
   */
  async getUserById(userId: number): Promise<User | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.USER_GET_BY_ID, { userId }))
  },
  /**
   * Update the avatar.
   * @param avatar - The avatar to update.
   * @returns The response from the API.
   */
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
  /**
   * Update the user info.
   * @param user - The user to update.
   * @returns The response from the API.
   */
  async updateUserInfo(user: UserUpdate): Promise<boolean> {
    return (
      (await axiosInstance.put(getPath(ApiEndpoint.USER_UPDATE), user, {
        requiresAuth: true,
      })) !== null
    )
  },
  /**
   * Delete a user.
   * @param userId - The ID of the user to delete.
   * @returns The response from the API.
   */
  async deleteUser(userId: number): Promise<boolean> {
    return (
      (await axiosInstance.delete(getPath(ApiEndpoint.USER_DELETE, { userId }), {
        requiresAuth: true,
      })) !== null
    )
  },
  /**
   * Search users.
   * @param keyword - The keyword to search.
   * @param page - The page number to get.
   * @returns The users.
   */
  async searchUsers(keyword: string, page: number): Promise<UserWithAdminInfo[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.USER_SEARCH)}?keyword=${keyword}&page=${page}`,
      {
        requiresAuth: true,
      },
    )
  },
  /**
   * Search users count.
   * @param keyword - The keyword to search.
   * @returns The count and total pages of the users.
   */
  async searchUsersCount(keyword: string): Promise<{ totalCount: number; totalPages: number }> {
    const totalPages: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.USER_SEARCH_PAGE_COUNT)}?keyword=${keyword}`,
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.USER_SEARCH_COUNT)}?keyword=${keyword}`,
      {
        requiresAuth: true,
      },
    )
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
  },
}
