<script lang="ts" setup>
import { commentApi } from '@/api/comment.ts'
import type { Comment, WebSocketMessage } from '@/types'
import { likeApi } from '@/api/like.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { SortBy, WebSocketMessageType } from '@/constant'
import { WebSocketServiceInstance } from '@/service/webSocketService.ts'
import { useUserStore } from '@/stores/user.ts'

const authStore = useAuthStore()
const userStore = useUserStore()

const page: Ref<number> = ref(0)
const comments: Ref<Comment[]> = ref([])
const loading: Ref<boolean> = ref(false)
const isMore: Ref<boolean> = ref(true)
const likeLoading: Ref<Record<number, boolean>> = ref({})
const likeCounts: Ref<Record<number, number>> = ref({})
const newReplyCounts: Ref<number> = ref(0)
const replyRefreshing: Ref<boolean> = ref(false)
const selfUserId: Ref<number | null | undefined> = ref()
const sortBy: Ref<SortBy> = ref(SortBy.TIME)

const { commentId } = defineProps<{
  commentId: string
  replyComment: (receiver: string) => void
  showBanDialog: (userId: number) => void
}>()

const toggleSortBy = () => {
  sortBy.value = sortBy.value === SortBy.TIME ? SortBy.LIKE : SortBy.TIME
  refreshComment()
}

const loadMore = async () => {
  loading.value = true
  page.value += 1
  await loadComment()
  loading.value = false
}

const loadComment = async () => {
  const commentsData = await commentApi.getCommentReplies(commentId, page.value, sortBy.value)
  if (commentsData.length === 0) {
    isMore.value = false
    return
  }
  const existingIds = new Set(comments.value.map((c) => c.id))
  const newComments = commentsData.filter((c) => !existingIds.has(c.id))
  comments.value.push(...newComments)
}

const refreshComment = async () => {
  replyRefreshing.value = true
  page.value = 0
  isMore.value = true
  comments.value = []
  await loadComment()
  newReplyCounts.value = 0
  replyRefreshing.value = false
}

const likeComment = async (commentId: number) => {
  likeLoading.value[commentId] = true
  if (!authStore.hasToken) await authStore.getNewIdentity()
  await likeApi.likeComment(commentId)
  likeLoading.value[commentId] = false
}

const fetchLikes = async () => {
  if (!comments) return
  for (const comment of comments.value) {
    likeCounts.value[comment.id] = await getLike(comment.id)
  }
}

const fetchLike = async (id: string) => {
  likeCounts.value[Number.parseInt(id)] = await getLike(id)
}

const getLike = async (commentId: number | string) => {
  return (await likeApi.getLikesByCommentId(commentId)) ?? 0
}

const onWebSocketMessage = (message: WebSocketMessage) => {
  const { type } = message
  if (type === WebSocketMessageType.LIKE_COMMENT) {
    const { commentId } = message.data as { commentId: string }
    fetchLike(commentId)
  } else if (type === WebSocketMessageType.NEW_COMMENT) {
    newReplyCounts.value++
  }
}

const fetchUserId = async () => {
  selfUserId.value = (await userStore.getUserInfo())?.id
}

const deleteComment = async (commentId: number) => {
  if (await commentApi.deleteComment(commentId))
    comments.value = comments.value.filter((comment) => comment.id !== commentId)
}

watch(
  () => commentId,
  async () => {
    await refreshComment()
    WebSocketServiceInstance.disconnectCommentWebSocket(commentId)
    WebSocketServiceInstance.connectCommentWebSocket(commentId, onWebSocketMessage)
  },
)

watch(comments, async () => await fetchLikes(), { deep: true })
watch(userStore.getUserInfo, async () => await fetchUserId())

onMounted(async () => {
  await fetchUserId()
  await refreshComment()
  WebSocketServiceInstance.connectCommentWebSocket(commentId, onWebSocketMessage)
})

onUnmounted(async () => {
  WebSocketServiceInstance.disconnectCommentWebSocket(commentId)
})
</script>

<template>
  <el-link
    v-if="newReplyCounts"
    class="refresh-button"
    type="primary"
    underline="never"
    @click="refreshComment"
  >
    <span v-if="replyRefreshing" class="loading" />
    <span>New Replies ({{ newReplyCounts }})</span>
  </el-link>
  <div class="comment-list-container">
    <div v-if="comments.length > 0" class="sort-type-button-wrapper">
      <ToggleSortTypeButton :sort-by="sortBy" :toggle-sort-by="toggleSortBy" />
    </div>
    <div
      v-for="(comment, index) in comments"
      :key="index"
      :class="{
        'last-child': comment.id === comments[comments.length - 1].id && !isMore,
        'is-more': comment.id === comments[comments.length - 1].id && isMore,
      }"
      class="comment"
    >
      <CommentView :comment="comment" />
      <div class="comment-action">
        <el-link
          :disabled="likeLoading[comment.id]"
          type="primary"
          underline="never"
          @click="likeComment(comment.id)"
        >
          <span v-if="likeLoading[comment.id]" class="loading" />
          <span>Like ({{ likeCounts[comment.id] }})</span>
        </el-link>
        <el-link
          type="primary"
          underline="never"
          @click="replyComment(comment.authorNickname.toString())"
          >Reply
        </el-link>
        <el-popconfirm
          v-if="comment.authorId === selfUserId || authStore.isLoggedIn"
          title="Are you sure to delete this comment?"
          @confirm="deleteComment(comment.id)"
        >
          <template #reference>
            <el-link type="danger" underline="never">Delete</el-link>
          </template>
        </el-popconfirm>
        <el-link
          v-if="authStore.isLoggedIn && comment.authorId !== selfUserId"
          type="warning"
          underline="never"
          @click="showBanDialog(comment.authorId)"
          >Ban
        </el-link>
      </div>
    </div>
  </div>
  <el-link v-if="isMore" class="load-button" type="primary" underline="never" @click="loadMore">
    <span v-if="loading" class="loading" />
    <span>Load More...</span>
  </el-link>
</template>

<style scoped>
.comment {
  margin-top: 16px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}

.comment.last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.comment.is-more {
  margin-bottom: 8px;
}

.load-button {
  margin-left: 48px;
  padding-bottom: 10px;
}

.loading {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #409eff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 4px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.comment-action {
  margin-top: 8px;
  margin-left: 48px;
  gap: 12px;
  display: flex;
}

.refresh-button {
  margin-left: 48px;
}

.comment-list-container {
  position: relative;
}

.sort-type-button-wrapper {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
