import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import axiosInstance from '@/utils/axios.ts'
import type { Like } from '@/types'

export const likeApi = {
  async getLikesByPostId(postId: number): Promise<Like[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_GET_ALL_BY_POST_ID, { postId }))
  },
  async getLikesByCommentId(commentId: number): Promise<Like[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_GET_ALL_BY_COMMENT_ID, { commentId }))
  },
  async likePost(postId: number): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.LIKE_POST, { postId }))
  },
  async likeComment(commentId: number): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.LIKE_COMMENT, { commentId }))
  },
}
