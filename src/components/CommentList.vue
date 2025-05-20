<script lang="ts" setup>
import { DateTime } from 'luxon'
import type { Comment } from '@/types'
import { likeApi } from '@/api/like.ts'
import { useAuthStore } from '@/stores/auth.ts'

const { comments } = defineProps<{
  comments: Comment[] | undefined
}>()

const authStore = useAuthStore()

const likeCounts = ref<Record<string, number>>({})
const likeLoading = ref<Record<string, boolean>>({})

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

watch(() => comments, fetchLikes)

onMounted(() => {
  fetchLikes()
})

defineExpose({ fetchLike })
</script>

<template>
  <div v-for="(comment, index) in comments" :key="index" class="comment">
    <div class="comment-author">
      <el-avatar :size="36"></el-avatar>
      <div class="comment-info">
        <div class="comment-name">{{ comment.authorNickname }}</div>
        <div class="comment-time">
          {{
            DateTime.fromISO(comment.createdAt)
              .toLocal()
              .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
          }}
        </div>
      </div>
    </div>
    <div class="comment-content">
      {{ comment.content }}
    </div>
    <div class="comment-action">
      <el-link
        :disabled="likeLoading[comment.id]"
        :underline="'never'"
        type="primary"
        @click="likeComment(comment.id)"
      >
        <span v-if="likeLoading[comment.id]" class="like-loading"></span>
        <span>Like ({{ likeCounts[comment.id] }})</span>
      </el-link>
      <!--            <el-link type="text">Reply</el-link>-->
    </div>
  </div>
</template>

<style scoped>
.comment {
  padding: 16px 0 10px 0;
  border-bottom: 1px solid #eaeaea;
}

.comment-author {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.comment-info {
  margin-left: 12px;
}

.comment-name {
  font-weight: bold;
}

.comment-time {
  margin-top: 2px;
  font-size: 12px;
  color: #999999;
}

.comment-content {
  overflow-wrap: break-word;
  font-size: 14px;
  line-height: 1.6;
  margin-left: 48px;
}

.comment-action {
  margin-top: 8px;
  margin-left: 48px;
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
</style>
