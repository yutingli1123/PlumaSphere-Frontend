import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import axiosInstance from '@/utils/axios.ts'

/**
 * The like API.
 */
export const likeApi = {
  /**
   * Get the number of likes by post ID.
   * @param postId - The ID of the post to get the number of likes for.
   * @returns The number of likes.
   */
  async getLikesByPostId(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_COUNT_BY_POST_ID, { postId }))
  },
  /**
   * Get the number of likes by comment ID.
   * @param commentId - The ID of the comment to get the number of likes for.
   * @returns The number of likes.
   */
  async getLikesByCommentId(commentId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_COUNT_BY_COMMENT_ID, { commentId }))
  },
  /**
   * Check if the post is liked.
   * @param postId - The ID of the post to check if it is liked.
   * @returns The response from the API.
   */
  async checkPostLikeState(postId: number | string): Promise<boolean> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_POST_STATE, { postId }), {
      requiresAuth: true,
    })
  },
  /**
   * Check if the comment is liked.
   * @param commentId - The ID of the comment to check if it is liked.
   * @returns The response from the API.
   */
  async checkCommentLikeState(commentId: number | string): Promise<boolean> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_COMMENT_STATE, { commentId }), {
      requiresAuth: true,
    })
  },
  /**
   * Like a post.
   * @param postId - The ID of the post to like.
   */
  async likePost(postId: number | string): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.LIKE_POST, { postId }), null, {
      requiresAuth: true,
    })
  },
  /**
   * Like a comment.
   * @param commentId - The ID of the comment to like.
   */
  async likeComment(commentId: number | string): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.LIKE_COMMENT, { commentId }), null, {
      requiresAuth: true,
    })
  },
}
