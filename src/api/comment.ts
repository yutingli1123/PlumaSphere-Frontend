import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Comment, CommentRequest } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { SortBy } from '@/constant'

/**
 * The comment API.
 */
export const commentApi = {
  /**
   * Get comments by post ID.
   * @param postId - The ID of the post to get comments for.
   * @param page - The page number to get.
   * @param sortBy - The sort by field.
   * @returns The comments.
   */
  async getCommentsByPostId(
    postId: number | string,
    page: number | string,
    sortBy: SortBy = SortBy.TIME,
  ): Promise<Comment[] | undefined> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_GET_ALL_BY_POST_ID, { postId })}?page=${page}&sortBy=${sortBy.toLowerCase()}`,
    )
  },
  /**
   * Get the number of comment pages by post ID.
   * @param postId - The ID of the post to get the number of comment pages for.
   * @returns The number of comment pages.
   */
  async getCommentPagesByPostId(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_PAGE_COUNT_BY_POST_ID, { postId }))
  },
  /**
   * Get the number of comments by post ID.
   * @param postId - The ID of the post to get the number of comments for.
   * @returns The number of comments.
   */
  async getCommentCount(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_COUNT_BY_POST_ID, { postId }))
  },
  /**
   * Get comments by user ID.
   * @param userId - The ID of the user to get comments for.
   * @param page - The page number to get.
   * @returns The comments.
   */
  async getCommentsByUserId(userId: number | string, page: number): Promise<Comment[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_GET_ALL_BY_USER_ID, { userId })}?page=${page}`,
      {
        requiresAuth: true,
      },
    )
  },
  /**
   * Get the number of comments by user ID.
   * @param userId - The ID of the user to get the number of comments for.
   * @returns The number of comments.
   */
  async getCommentCountByUserId(
    userId: number | string,
  ): Promise<{ totalCount: number; totalPages: number }> {
    const totalCount: number = await axiosInstance.get(
      getPath(ApiEndpoint.COMMENT_GET_ALL_BY_USER_ID_COUNT, { userId }),
      {
        requiresAuth: true,
      },
    )
    const totalPages: number = await axiosInstance.get(
      getPath(ApiEndpoint.COMMENT_GET_ALL_BY_USER_ID_PAGE_COUNT, { userId }),
      {
        requiresAuth: true,
      },
    )
    return {
      totalCount: totalCount,
      totalPages: totalPages,
    }
  },
  /**
   * Add a comment.
   * @param comment - The comment to add.
   * @param postId - The ID of the post to add the comment to.
   */
  async addComment(comment: CommentRequest, postId: number | string): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.COMMENT_CREATE_BY_POST_ID, { postId }), comment, {
      requiresAuth: true,
    })
  },
  /**
   * Reply to a comment.
   * @param comment - The comment to reply to.
   * @param commentId - The ID of the comment to reply to.
   * @returns The response from the API.
   */
  async replyComment(comment: CommentRequest, commentId: number): Promise<boolean> {
    return (
      (await axiosInstance.post(
        getPath(ApiEndpoint.COMMENT_REPLY_BY_COMMENT_ID, { commentId }),
        comment,
        {
          requiresAuth: true,
        },
      )) !== null
    )
  },
  /**
   * Get comment replies.
   * @param commentId - The ID of the comment to get replies for.
   * @param page - The page number to get.
   * @param sortBy - The sort by field.
   * @returns The replies.
   */
  async getCommentReplies(
    commentId: string | number,
    page: number,
    sortBy: SortBy = SortBy.TIME,
  ): Promise<Comment[] | []> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_REPLY_BY_COMMENT_ID, { commentId })}?page=${page}&sortBy=${sortBy.toLowerCase()}`,
    )
  },
  /**
   * Delete a comment.
   * @param commentId - The ID of the comment to delete.
   * @returns The response from the API.
   */
  async deleteComment(commentId: number | string): Promise<boolean> {
    return (
      (await axiosInstance.delete(getPath(ApiEndpoint.COMMENT_DELETE, { commentId }), {
        requiresAuth: true,
      })) !== null
    )
  },
}
