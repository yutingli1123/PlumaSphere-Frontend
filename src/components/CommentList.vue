<script lang="ts" setup>
import type { Comment } from '@/types'
import { likeApi } from '@/api/like.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { commentApi } from '@/api/comment.ts'
import CommentReplyList from '@/components/CommentReplyList.vue'

const { comments } = defineProps<{
  comments: Comment[] | undefined
}>()

const authStore = useAuthStore()

const likeCounts = ref<Record<string, number>>({})
const likeLoading = ref<Record<string, boolean>>({})
const commentReplying = ref<Record<number, boolean>>({})
const commentReplyingContent = ref<Record<number, string>>({})
const replyLoading = ref<Record<number, boolean>>({})

const fetchLikes = async () => {
  if (!comments) return
  for (const comment of comments) {
    likeCounts.value[comment.id] = await getLike(comment.id)
  }
}

const fetchLike = async (id: string) => {
  likeCounts.value[id] = await getLike(id)
}

const getLike = async (commentId: number | string) => {
  return (await likeApi.getLikesByCommentId(commentId)) ?? 0
}

const likeComment = async (commentId: number | string) => {
  likeLoading.value[commentId] = true
  if (!authStore.hasToken) await authStore.getNewIdentity()
  await likeApi.likeComment(commentId)
  likeLoading.value[commentId] = false
}

const switchReplyComment = async (commentId: number) => {
  if (commentReplying.value[commentId]) {
    commentReplying.value[commentId] = false
    commentReplyingContent.value[commentId] = ''
  } else {
    commentReplying.value[commentId] = true
  }
}

const replyComment = async (commentId: number) => {
  replyLoading.value[commentId] = true
  if (!authStore.hasToken) await authStore.getNewIdentity()
  await commentApi.replyComment(
    {
      content: commentReplyingContent.value[commentId],
    },
    commentId,
  )
  commentReplyingContent.value[commentId] = ''
  replyLoading.value[commentId] = false
}

watch(() => comments, fetchLikes)

onMounted(() => {
  fetchLikes()
})

defineExpose({ fetchLike })
</script>

<template>
  <div v-for="(comment, index) in comments" :key="index" class="comment">
    <CommentView :comment="comment" />
    <div class="comment-action">
      <el-link
        :disabled="likeLoading[comment.id]"
        underline="never"
        type="primary"
        @click="likeComment(comment.id)"
      >
        <span v-if="likeLoading[comment.id]" class="like-loading" />
        <span>Like ({{ likeCounts[comment.id] }})</span>
      </el-link>
      <el-link type="primary" underline="never" @click="switchReplyComment(comment.id)"
        >Reply
      </el-link>
    </div>
    <transition name="reply-expand">
      <div v-if="commentReplying[comment.id]" class="comment-reply-container">
        <el-input
          v-model="commentReplyingContent[comment.id]"
          :rows="4"
          resize="none"
          type="textarea"
        />
        <div class="comment-reply-button">
          <el-button :loading="replyLoading[comment.id]" @click="replyComment(comment.id)"
            >Reply
          </el-button>
        </div>
      </div>
    </transition>
    <div class="comment-reply-list">
      <CommentReplyList :comment-id="comment.id" />
    </div>
  </div>
</template>

<style scoped>
.comment {
  padding: 16px 0 10px 0;
  border-bottom: 1px solid #eaeaea;
}

.comment-action {
  margin-top: 8px;
  margin-left: 48px;
  gap: 12px;
  display: flex;
}

.like-loading {
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

.comment-reply-container {
  margin-top: 14px;
  margin-left: 48px;
}

.comment-reply-button {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.reply-expand-enter-active,
.reply-expand-leave-active {
  transition: max-height 0.3s linear;
  overflow: hidden;
}

.reply-expand-enter-from,
.reply-expand-leave-to {
  max-height: 0;
}

.reply-expand-enter-to,
.reply-expand-leave-from {
  max-height: 200px;
}

.comment-reply-list {
  margin-top: 14px;
  margin-left: 48px;
}
</style>
