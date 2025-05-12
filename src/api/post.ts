import type { Article } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const postApi = {
  async getAllPosts(page: number): Promise<Article[] | undefined> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.POST_GET_ALL)}?page=${page}`)
  },
  async getPostById(id: string): Promise<Article | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_GET_BY_ID, { id }))
  },
  async createPost(post: Article): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.POST_CREATE), post, {
      requiresAuth: true,
    })
  },
  async getPostsCount(): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_GET_COUNT))
  },
}
