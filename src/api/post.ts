import type { Article, ArticleRequest, ArticleUpdateRequest } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

export const postApi = {
  async getAllPosts(page: number): Promise<Article[] | undefined> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.POST_GET_ALL)}?page=${page}`)
  },
  async getPostById(id: string | number): Promise<Article | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_GET_BY_ID, { id }))
  },
  async createPost(post: ArticleRequest): Promise<boolean> {
    return (
      (await axiosInstance.post(getPath(ApiEndpoint.POST_CREATE), post, {
        requiresAuth: true,
      })) !== null
    )
  },
  async updatePost(post: ArticleUpdateRequest): Promise<boolean> {
    return (
      (await axiosInstance.put(getPath(ApiEndpoint.POST_UPDATE), post, {
        requiresAuth: true,
      })) !== null
    )
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
  async getAllPostsByTag(tagName: string, page: number): Promise<Article[] | undefined> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_GET_ALL_BY_TAG_NAME)}?tagName=${tagName}&page=${page}`,
    )
  },
  async getPostCountByTag(tagName: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_COUNT_BY_TAG_NAME)}?tagName=${tagName}`,
    )
  },
  async getPostPageCountByTag(tagName: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_PAGE_COUNT_BY_TAG_NAME)}?tagName=${tagName}`,
    )
  },
  async getPostPageCountBySearchQuery(query: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_PAGE_COUNT_BY_SEARCH_QUERY)}?query=${query}`,
    )
  },
  async getPostCountBySearchQuery(query: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_COUNT_BY_SEARCH_QUERY)}?query=${query}`,
    )
  },
  async getAllPostsBySearchQuery(query: string, page: number): Promise<Article[] | undefined> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_GET_ALL_BY_SEARCH_QUERY)}?query=${query}&page=${page}`,
    )
  },
}
