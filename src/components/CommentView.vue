<script lang="ts" setup>
import { DateTime } from 'luxon'
import type { Comment, User } from '@/types'
import { onMounted } from 'vue'
import { userApi } from '@/api/user.ts'

const { comment } = defineProps<{
  comment: Comment
}>()

const user: Ref<User | undefined> = ref()

const fetchUser = async () => {
  user.value = await userApi.getUserById(comment.authorId)
}

watch(
  () => comment,
  async () => await fetchUser(),
)

onMounted(async () => await fetchUser())
</script>

<template>
  <div class="comment-author">
    <el-avatar
      :size="36"
      :src="user?.avatarUrl"
      :style="{ backgroundColor: !user?.avatarUrl ? user?.avatarColor : undefined }"
    >
      <div class="comment-name">
        {{ !user?.avatarUrl ? user?.initials : undefined }}
      </div>
    </el-avatar>
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
</template>

<style scoped>
.comment-author {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
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
  white-space: pre-line;
  font-size: 14px;
  line-height: 1.5;
  margin-left: 48px;
}
</style>
