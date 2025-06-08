import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Comment, CommentRequest } from '@/types'
import axiosInstance from '@/utils/axios.ts'
import { SortBy } from '@/constant'

export const commentApi = {
  async getCommentsByPostId(
    postId: number | string,
    page: number | string,
    sortBy: SortBy = SortBy.TIME,
  ): Promise<Comment[] | undefined> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_GET_ALL_BY_POST_ID, { postId })}?page=${page}&sortBy=${sortBy.toLowerCase()}`,
    )
  },
  async getCommentPagesByPostId(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_PAGE_COUNT_BY_POST_ID, { postId }))
  },
  async getCommentCount(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_COUNT_BY_POST_ID, { postId }))
  },
  async getCommentsByUserId(userId: number | string, page: number): Promise<Comment[]> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_GET_ALL_BY_USER_ID, { userId })}?page=${page}`,
      {
        requiresAuth: true,
      },
    )
  },
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
  async addComment(comment: CommentRequest, postId: number | string): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.COMMENT_CREATE_BY_POST_ID, { postId }), comment, {
      requiresAuth: true,
    })
  },
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
  async getCommentReplies(
    commentId: string | number,
    page: number,
    sortBy: SortBy = SortBy.TIME,
  ): Promise<Comment[] | []> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_REPLY_BY_COMMENT_ID, { commentId })}?page=${page}&sortBy=${sortBy.toLowerCase()}`,
    )
  },
  async deleteComment(commentId: number | string): Promise<boolean> {
    return (
      (await axiosInstance.delete(getPath(ApiEndpoint.COMMENT_DELETE, { commentId }), {
        requiresAuth: true,
      })) !== null
    )
  },
}
