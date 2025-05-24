import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Comment, CommentRequest } from '@/types'
import axiosInstance from '@/utils/axios.ts'

export const commentApi = {
  async getCommentById(id: number): Promise<Comment | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_GET_BY_ID, { id }))
  },
  async getCommentsByPostId(
    postId: number | string,
    page: number | string,
  ): Promise<Comment[] | undefined> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_GET_ALL_BY_POST_ID, { postId })}?page=${page}`,
    )
  },
  async getCommentPagesByPostId(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_PAGE_COUNT_BY_POST_ID, { postId }))
  },
  async getCommentCount(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_COUNT_BY_POST_ID, { postId }))
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
  async getCommentReplies(commentId: string | number, page: number): Promise<Comment[] | []> {
    return await axiosInstance.get(
      `${getPath(ApiEndpoint.COMMENT_REPLY_BY_COMMENT_ID, { commentId })}?page=${page}`,
    )
  },
  async deleteComment(commentId: number | string): Promise<void> {
    await axiosInstance.delete(getPath(ApiEndpoint.COMMENT_DELETE, { commentId }), {
      requiresAuth: true,
    })
  },
}
