import type { Tag } from '@/types'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import axiosInstance from '@/utils/axios.ts'

/**
 * The tag API.
 */
export const tagApi = {
  /**
   * Get all tags.
   * @returns The tags.
   */
  async getAllTags(): Promise<Tag[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.TAG_GET_ALL))
  },
  /**
   * Add a tag.
   * @param tag - The tag to add.
   */
  async addTag(tag: Tag): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.TAG_ADD), tag, {
      requiresAuth: true,
    })
  },
}
