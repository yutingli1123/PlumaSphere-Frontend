<script lang="ts" setup>
import { onMounted } from 'vue'
import { commentApi } from '@/api/comment.ts'
import type { Comment } from '@/types'
import { likeApi } from '@/api/like.ts'
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()

const page: Ref<number> = ref(0)
const comments: Ref<Comment[]> = ref([])
const loading: Ref<boolean> = ref(false)
const isMore: Ref<boolean> = ref(true)
const likeLoading: Ref<Record<number, boolean>> = ref({})
const likeCounts: Ref<Record<number, number>> = ref({})

const { commentId } = defineProps<{
  commentId: number
}>()

const loadMore = async () => {
  loading.value = true
  page.value += 1
  await loadComment()
  loading.value = false
}

const loadComment = async () => {
  const commentsData = await commentApi.getCommentReplies(commentId, page.value)
  if (commentsData.length === 0) {
    isMore.value = false
    return
  }
  comments.value.push(...commentsData)
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

const fetchLike = async (id: number) => {
  likeCounts.value[id] = await getLike(id)
}

const getLike = async (commentId: number | string) => {
  return (await likeApi.getLikesByCommentId(commentId)) ?? 0
}

watch(
  () => comments.value,
  () => {
    fetchLikes()
  },
)

onMounted(async () => {
  await loadComment()
  await fetchLikes()
})
</script>

<template>
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
      <el-link type="primary" underline="never">Reply</el-link>
    </div>
  </div>
  <el-link v-if="isMore" class="load-button" type="primary" underline="never" @click="loadMore">
    <span v-if="loading" class="loading" />
    <span>Load More...</span>
  </el-link>
</template>

<style scoped>
.comment {
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
</style>
