import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { BannedIp, BanRequest, UserWithBanInfo } from '@/types'

export const adminApi = {
  async banUser(banRequest: BanRequest): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_USER), banRequest, {
      requiresAuth: true,
    })
  },
  async banIPByUserId(banRequest: BanRequest): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_IP_BY_USER_ID), banRequest, {
      requiresAuth: true,
    })
  },
  async getBannedUsers(page: number): Promise<UserWithBanInfo[]> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.GET_BANNED_USERS)}?page=${page}`, {
      requiresAuth: true,
    })
  },
  async getBannedUsersCount(): Promise<{ totalCount: number; totalPages: number }> {
    const totalPages: number = await axiosInstance.get(
      getPath(ApiEndpoint.GET_BANNED_USERS_PAGE_COUNT),
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(
      getPath(ApiEndpoint.GET_BANNED_USERS_COUNT),
      {
        requiresAuth: true,
      },
    )
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
  },
  async getBannedIps(page: number): Promise<BannedIp[]> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.GET_BANNED_IPS)}?page=${page}`, {
      requiresAuth: true,
    })
  },
  async getBannedIpsCount(): Promise<{ totalCount: number; totalPages: number }> {
    const totalPages: number = await axiosInstance.get(
      getPath(ApiEndpoint.GET_BANNED_IPS_PAGE_COUNT),
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(getPath(ApiEndpoint.GET_BANNED_IPS_COUNT), {
      requiresAuth: true,
    })
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
  },
}
