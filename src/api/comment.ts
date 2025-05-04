import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Comment } from '@/types'
import axiosInstance from '@/utils/axios.ts'

export const commentApi = {
  async getCommentById(id: number): Promise<Comment> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.COMMENT_GET_BY_ID, { id }))
    return JSON.parse(response.data)
  },
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const response = await axiosInstance.get(
      getPath(ApiEndpoint.COMMENT_GET_ALL_BY_POST_ID, { postId }),
    )
    return JSON.parse(response.data)
  },
  async addComment(comment: Comment, postId: number): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.COMMENT_CREATE_BY_POST_ID, { postId }), comment)
  },
}
