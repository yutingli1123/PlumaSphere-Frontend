<script lang="ts" setup>
import { DateTime } from 'luxon'
import type { Comment } from '@/types'

const { comments } = defineProps<{
  comments: Comment[] | undefined
}>()
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
  </div>
</template>

<style scoped>
.comment {
  padding: 16px 0;
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
</style>
