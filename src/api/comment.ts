import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Comment } from '@/types'
import axiosInstance, { getResponseData } from '@/utils/axios.ts'

export const commentApi = {
  async getCommentById(id: number): Promise<Comment | undefined> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.COMMENT_GET_BY_ID, { id }))
    return getResponseData(response)
  },
  async getCommentsByPostId(postId: number): Promise<Comment[] | undefined> {
    const response = await axiosInstance.get(
      getPath(ApiEndpoint.COMMENT_GET_ALL_BY_POST_ID, { postId }),
    )
    return getResponseData(response)
  },
  async addComment(comment: Comment, postId: number): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.COMMENT_CREATE_BY_POST_ID, { postId }), comment)
  },
}
