import type { Article, ArticleRequest, ArticleUpdateRequest } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'

/**
 * The post API.
 */
export const postApi = {
  /**
   * Get all posts.
   * @param page - The page number to get.
   * @returns The posts.
   */
  async getAllPosts(page: number): Promise<Article[] | undefined> {
    return await axiosInstance.get(`${getPath(ApiEndpoint.POST_GET_ALL)}?page=${page}`)
  },
  /**
   * Get a post by ID.
   * @param id - The ID of the post to get.
   * @returns The post.
   */
  async getPostById(id: string | number): Promise<Article | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_GET_BY_ID, { id }))
  },
  /**
   * Create a post.
   * @param post - The post to create.
   * @returns The response from the API.
   */
  async createPost(post: ArticleRequest): Promise<boolean> {
    return (
      (await axiosInstance.post(getPath(ApiEndpoint.POST_CREATE), post, {
        requiresAuth: true,
      })) !== null
    )
  },
  /**
   * Update a post.
   * @param post - The post to update.
   * @returns The response from the API.
   */
  async updatePost(post: ArticleUpdateRequest): Promise<boolean> {
    return (
      (await axiosInstance.put(getPath(ApiEndpoint.POST_UPDATE), post, {
        requiresAuth: true,
      })) !== null
    )
  },
  /**
   * Get the number of post pages.
   * @returns The number of post pages.
   */
  async getPostPages(): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_PAGE_COUNT))
  },
  /**
   * Get the number of posts.
   * @returns The number of posts.
   */
  async getPostCount(): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.POST_COUNT))
  },
  /**
   * Delete a post.
   * @param id - The ID of the post to delete.
   */
  async deletePost(id: string): Promise<void> {
    await axiosInstance.delete(getPath(ApiEndpoint.POST_DELETE, { id }), {
      requiresAuth: true,
    })
  },
  /**
   * Get all posts by tag name.
   * @param tagName - The name of the tag to get posts for.
   * @param page - The page number to get.
   * @returns The posts.
   */
  async getAllPostsByTag(tagName: string, page: number): Promise<Article[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_GET_ALL_BY_TAG_NAME)}?tagName=${tagName}&page=${page}`,
    )
  },
  /**
   * Get the number of posts by tag name.
   * @param tagName - The name of the tag to get posts for.
   * @returns The number of posts.
   */
  async getPostCountByTag(tagName: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_COUNT_BY_TAG_NAME)}?tagName=${tagName}`,
    )
  },
  /**
   * Get the number of post pages by tag name.
   * @param tagName - The name of the tag to get posts for.
   * @returns The number of post pages.
   */
  async getPostPageCountByTag(tagName: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_PAGE_COUNT_BY_TAG_NAME)}?tagName=${tagName}`,
    )
  },
  /**
   * Get the number of post pages by search query.
   * @param query - The search query to get posts for.
   * @returns The number of post pages.
   */
  async getPostPageCountBySearchQuery(query: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_PAGE_COUNT_BY_SEARCH_QUERY)}?query=${query}`,
    )
  },
  /**
   * Get the number of posts by search query.
   * @param query - The search query to get posts for.
   * @returns The number of posts.
   */
  async getPostCountBySearchQuery(query: string): Promise<number> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_COUNT_BY_SEARCH_QUERY)}?query=${query}`,
    )
  },
  /**
   * Get all posts by search query.
   * @param query - The search query to get posts for.
   * @param page - The page number to get.
   * @returns The posts.
   */
  async getAllPostsBySearchQuery(query: string, page: number): Promise<Article[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.POST_GET_ALL_BY_SEARCH_QUERY)}?query=${query}&page=${page}`,
    )
  },
}
