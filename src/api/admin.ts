import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { DateTime } from 'luxon'

export const adminApi = {
  async banUser(userId: number | string, reason: string): Promise<string> {
    return await axiosInstance.post(getPath(ApiEndpoint.BAN_USER, { id: userId, reason }), null, {
      requiresAuth: true,
    })
  },
  async banUserTemporarily(
    userId: number | string,
    reason: string,
    expireAt: DateTime,
  ): Promise<string> {
    const dateTimeISO = expireAt.toISO()
    if (!dateTimeISO) {
      return 'Invalid DateTime'
    }
    return await axiosInstance.post(
      getPath(ApiEndpoint.BAN_USER, {
        id: userId,
        reason,
        expiresAt: dateTimeISO,
      }),
      null,
      {
        requiresAuth: true,
      },
    )
  },
  async banIPByUserId(userId: number | string, reason: string): Promise<string> {
    return await axiosInstance.post(
      getPath(ApiEndpoint.BAN_IP_BY_USER_ID, { id: userId, reason }),
      null,
      {
        requiresAuth: true,
      },
    )
  },
  async banIPByUserIdTemporarily(
    userId: number | string,
    reason: string,
    expireAt: DateTime,
  ): Promise<string> {
    const dateTimeISO = expireAt.toISO()
    if (!dateTimeISO) {
      return 'Invalid DateTime'
    }
    return await axiosInstance.post(
      getPath(ApiEndpoint.BAN_IP_BY_USER_ID, {
        id: userId,
        reason,
        expiresAt: dateTimeISO,
      }),
      null,
      {
        requiresAuth: true,
      },
    )
  },
}
