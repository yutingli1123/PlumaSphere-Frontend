import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { BannedIp, BanRequest, UserWithAdminInfo } from '@/types'

export const adminApi = {
  async banUser(banRequest: BanRequest): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_USER), banRequest, {
      requiresAuth: true,
    })
  },
  async unbanUser(userId: number): Promise<string> {
    return await axiosInstance.delete(`${getPath(ApiEndpoint.UNBAN_USER)}?userId=${userId}`, {
      requiresAuth: true,
    })
  },
  async banIPForUser(banRequest: BanRequest): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_IP_BY_USER_ID), banRequest, {
      requiresAuth: true,
    })
  },
  async unbanIPForUser(userId: number): Promise<string> {
    return await axiosInstance.delete(
      `${getPath(ApiEndpoint.UNBAN_IP_BY_USER_ID)}?userId=${userId}`,
      {
        requiresAuth: true,
      },
    )
  },
  async getBannedUsers(page: number): Promise<UserWithAdminInfo[]> {
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
  async banIp(banRequest: BanRequest): Promise<BannedIp> {
    return await axiosInstance.post(
      getPath(ApiEndpoint.BAN_IP),
      { banRequest },
      {
        requiresAuth: true,
      },
    )
  },
  async unbanIp(ipAddress: string): Promise<boolean> {
    return await axiosInstance.delete(`${getPath(ApiEndpoint.UNBAN_IP)}?ipAddress=${ipAddress}`, {
      requiresAuth: true,
    })
  },
}
