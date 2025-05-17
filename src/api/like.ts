import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import axiosInstance from '@/utils/axios.ts'

export const likeApi = {
  async getLikesByPostId(postId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_COUNT_BY_POST_ID, { postId }))
  },
  async getLikesByCommentId(commentId: number | string): Promise<number> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_COUNT_BY_COMMENT_ID, { commentId }))
  },
  async checkPostLikeState(postId: number | string): Promise<boolean> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_POST_STATE, { postId }), {
      requiresAuth: true,
    })
  },
  async checkCommentLikeState(commentId: number | string): Promise<boolean> {
    return await axiosInstance.get(getPath(ApiEndpoint.LIKE_COMMENT_STATE, { commentId }), {
      requiresAuth: true,
    })
  },
  async likePost(postId: number | string): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.LIKE_POST, { postId }), null, {
      requiresAuth: true,
    })
  },
  async likeComment(commentId: number | string): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.LIKE_COMMENT, { commentId }), null, {
      requiresAuth: true,
    })
  },
}
