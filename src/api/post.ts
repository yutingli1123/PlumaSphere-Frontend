import type { Article } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const postApi = {
  async getAllPosts(): Promise<Article[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_GET_ALL))
  },
  async getPostById(id: string): Promise<Article | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_GET_BY_ID, { id }))
  },
  async createPost(post: Article): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.POST_CREATE), post)
  },
}
