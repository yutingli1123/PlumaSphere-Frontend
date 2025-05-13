import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Comment, CommentRequest } from '@/types'
import axiosInstance from '@/utils/axios.ts'

export const commentApi = {
  async getCommentById(id: number): Promise<Comment | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_GET_BY_ID, { id }))
  },
  async getCommentsByPostId(postId: number | string): Promise<Comment[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.COMMENT_GET_ALL_BY_POST_ID, { postId }))
  },
  async addComment(comment: CommentRequest, postId: number | string): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.COMMENT_CREATE_BY_POST_ID, { postId }), comment, {
      requiresAuth: true,
    })
  },
}
