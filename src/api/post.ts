import type { Article } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const postApi = {
  async getAllPosts(): Promise<Article[]> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.POST_GET_ALL))
    return JSON.parse(response.data)
  },
  async getPostById(id: number): Promise<Article> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.POST_GET_BY_ID, { id }))
    return JSON.parse(response.data)
  },
  async createPost(post: Article): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.POST_CREATE), post)
  },
}
