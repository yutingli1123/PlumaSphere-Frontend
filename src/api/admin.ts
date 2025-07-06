import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { BanIpRequest, BannedIp, BanRequest, UserWithAdminInfo } from '@/types'

/**
 * Admin API for managing user bans and IP bans.
 */
export const adminApi = {
  /**
   * Ban a user.
   * @param banRequest - The request object containing user ID and ban reason.
   */
  async banUser(banRequest: BanRequest): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_USER), banRequest, {
      requiresAuth: true,
    })
  },
  /**
   * Unban a user.
   * @param userId - The ID of the user to unban.
   * @returns The response from the API.
   */
  async unbanUser(userId: number): Promise<string> {
    return await axiosInstance.delete(`${getPath(ApiEndpoint.UNBAN_USER)}?id=${userId}`, {
      requiresAuth: true,
    })
  },
  /**
   * Ban an IP for a user.
   * @param banRequest - The request object containing user ID and ban reason.
   * @returns The response from the API.
   */
  async banIPForUser(banRequest: BanRequest): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_IP_BY_USER_ID), banRequest, {
      requiresAuth: true,
    })
  },
  /**
   * Unban an IP for a user.
   * @param userId - The ID of the user to unban.
   * @returns The response from the API.
   */
  async unbanIPForUser(userId: number): Promise<string> {
    return await axiosInstance.delete(`${getPath(ApiEndpoint.UNBAN_IP_BY_USER_ID)}?id=${userId}`, {
      requiresAuth: true,
    })
  },
  /**
   * Get banned users.
   * @param page - The page number to get.
   * @returns The response from the API.
   */
  async getBannedUsers(page: number): Promise<UserWithAdminInfo[]> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.GET_BANNED_USERS)}?page=${page}`, {
      requiresAuth: true,
    })
  },
  /**
   * Get the count and total pages of banned users.
   * @returns The response from the API.
   */
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
  /**
   * Get banned IPs.
   * @param page - The page number to get.
   * @returns The response from the API.
   */
  async getBannedIps(page: number): Promise<BannedIp[]> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.GET_BANNED_IPS)}?page=${page}`, {
      requiresAuth: true,
    })
  },
  /**
   * Get the count and total pages of banned IPs.
   * @returns The response from the API.
   */
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
  /**
   * Get marked users.
   * @param page - The page number to get.
   * @returns The response from the API.
   */
  async getMarkedUsers(page: number): Promise<UserWithAdminInfo[]> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.GET_MARKED_USERS)}?page=${page}`, {
      requiresAuth: true,
    })
  },
  /**
   * Get the count and total pages of marked users.
   * @returns The response from the API.
   */
  async getMarkedUsersCount(): Promise<{ totalCount: number; totalPages: number }> {
    const totalPages: number = await axiosInstance.get(
      getPath(ApiEndpoint.GET_MARKED_USERS_PAGE_COUNT),
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(
      getPath(ApiEndpoint.GET_MARKED_USERS_COUNT),
      {
        requiresAuth: true,
      },
    )
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
  },
  /**
   * Ban an IP.
   * @param banRequest - The request object containing IP address and ban reason.
   * @returns The response from the API.
   */
  async banIp(banRequest: BanIpRequest): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_IP), banRequest, {
      requiresAuth: true,
    })
  },
  /**
   * Unban an IP.
   * @param ipAddress - The IP address to unban.
   * @returns The response from the API.
   */
  async unbanIp(ipAddress: string): Promise<boolean> {
    return (
      (await axiosInstance.delete(`${getPath(ApiEndpoint.UNBAN_IP)}?ipAddress=${ipAddress}`, {
        requiresAuth: true,
      })) !== null
    )
  },
  /**
   * Search banned users.
   * @param keyword - The keyword to search.
   * @param page - The page number to get.
   * @returns The users.
   */
  async searchBannedUsers(keyword: string, page: number): Promise<UserWithAdminInfo[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_BANNED_USERS)}?keyword=${keyword}&page=${page}`,
      {
        requiresAuth: true,
      },
    )
  },
  /**
   * Search banned users count.
   * @param keyword - The keyword to search.
   * @returns The count and total pages of the users.
   */
  async searchBannedUsersCount(
    keyword: string,
  ): Promise<{ totalCount: number; totalPages: number }> {
    const totalPages: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_BANNED_USERS_PAGE_COUNT)}?keyword=${keyword}`,
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_BANNED_USERS_COUNT)}?keyword=${keyword}`,
      {
        requiresAuth: true,
      },
    )
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
  },
  /**
   * Search marked users.
   * @param keyword - The keyword to search.
   * @param page - The page number to get.
   * @returns The users.
   */
  async searchMarkedUsers(keyword: string, page: number): Promise<UserWithAdminInfo[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_MARKED_USERS)}?keyword=${keyword}&page=${page}`,
      {
        requiresAuth: true,
      },
    )
  },
  /**
   * Search marked users count.
   * @param keyword - The keyword to search.
   * @returns The count and total pages of the users.
   */
  async searchMarkedUsersCount(
    keyword: strin,
  ): Promise<{ totalCount: number; totalPages: number }> {
    const totalPages: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_MARKED_USERS_PAGE_COUNT)}?keyword=${keyword}`,
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_MARKED_USERS_COUNT)}?keyword=${keyword}`,
      {
        requiresAuth: true,
      },
    )
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
  },
  /**
   * Search banned IPs.
   * @param keyword - The keyword to search.
   * @param page - The page number to get.
   * @returns The IPs.
   */
  async searchBannedIps(keyword: string, page: number): Promise<BannedIp[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_BANNED_IPS)}?keyword=${keyword}&page=${page}`,
      {
        requiresAuth: true,
      },
    )
  },
  /**
   * Search banned IPs count.
   * @param keyword - The keyword to search.
   * @returns The count and total pages of the IPs.
   */
  async searchBannedIpsCount(keyword: string): Promise<{ totalCount: number; totalPages: number }> {
    const totalPages: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_BANNED_IPS_PAGE_COUNT)}?keyword=${keyword}`,
      {
        requiresAuth: true,
      },
    )
    const totalCount: number = await axiosInstance.get(
      `${getPath(ApiEndpoint.SEARCH_BANNED_IPS_COUNT)}?keyword=${keyword}`,
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
