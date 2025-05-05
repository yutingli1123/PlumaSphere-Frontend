import type { Article } from '@/types'
import axiosInstance, { getResponseData } from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const postApi = {
  async getAllPosts(): Promise<Article[] | undefined> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.POST_GET_ALL))
    return getResponseData(response)
  },
  async getPostById(id: number): Promise<Article | undefined> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.POST_GET_BY_ID, { id }))
    return getResponseData(response)
  },
  async createPost(post: Article): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.POST_CREATE), post)
  },
}
