import type { Article, ArticleRequest } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const postApi = {
  async getAllPosts(page: number): Promise<Article[] | undefined> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.POST_GET_ALL)}?page=${page}`)
  },
  async getPostById(id: string | number): Promise<Article | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_GET_BY_ID, { id }))
  },
  async createPost(post: ArticleRequest): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.POST_CREATE), post, {
      requiresAuth: true,
    })
  },
  async getPostPages(): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_PAGE_COUNT))
  },
  async getPostCount(): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_COUNT))
  },
  async deletePost(id: string): Promise<void> {
    await axiosInstance.delete(getPath(ApiEndpoint.POST_DELETE, { id }), {
      requiresAuth: true,
    })
  },
}
