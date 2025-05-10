import type { Tag } from '@/types'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import axiosInstance from '@/utils/axios.ts'

export const tagApi = {
  async getAllTags(): Promise<Tag[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.TAG_GET_ALL))
  },
  async addTag(tag: Tag): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.TAG_ADD), tag, {
      requiresAuth: true,
    })
  },
}
