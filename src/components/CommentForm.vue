<script lang="ts" setup>
import { useUserStore } from '@/stores/user.ts'
import type { CommentRequest, User as UserInfo } from '@/types'
import { useAuthStore } from '@/stores/auth.ts'
import { commentApi } from '@/api/comment.ts'
import { onMounted } from 'vue'

const { postId } = defineProps<{
  postId: string
}>()

const commentContent = ref('')
const userStore = useUserStore()
const authStore = useAuthStore()
const userInfo: Ref<UserInfo | null> = ref(null)
const loadingIdentity: Ref<boolean> = ref(false)
const postingComment: Ref<boolean> = ref(false)

const getNewIdentity = async () => {
  loadingIdentity.value = true
  await authStore.getNewIdentity()
  loadingIdentity.value = false
}

const postComment = async () => {
  if (commentContent.value.trim().length === 0) return
  postingComment.value = true
  const comment: CommentRequest = {
    content: commentContent.value,
  }
  await commentApi.addComment(comment, postId)
  commentContent.value = ''
  postingComment.value = false
}

watch(userStore.getUserInfo, async () => {
  userInfo.value = await userStore.getUserInfo()
})

onMounted(async () => {
  userInfo.value = await userStore.getUserInfo()
})
</script>
<template>
  <div class="comment-form-container">
    <!-- Identity button -->
    <el-button
      class="identity-button"
      :disabled="!!userInfo"
      v-loading="loadingIdentity"
      @click="getNewIdentity"
    >
      <el-icon class="identity-icon">
        <IEpUser />
      </el-icon>
      {{
        userInfo
          ? userInfo.nickname
            ? `Comment as: ${userInfo.nickname}`
            : `Comment as: ${userInfo.username}`
          : 'Get Identity'
      }}
    </el-button>

    <!-- Comment input textarea -->
    <el-input
      :disabled="!userInfo"
      v-model="commentContent"
      :rows="4"
      class="comment-textarea"
      placeholder="Enter your comment here"
      resize="none"
      type="textarea"
    />

    <!-- Submit button -->
    <el-button
      :disabled="!commentContent.trim() || !userInfo"
      :loading="postingComment"
      class="submit-button"
      type="primary"
      @click="postComment"
    >
      Post Comment
    </el-button>
  </div>
</template>

<style scoped>
.identity-button {
  width: 100%;
  margin-bottom: 15px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.identity-icon {
  margin-right: 5px;
}

.comment-textarea {
  margin-bottom: 15px;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: normal;
  border-radius: 4px;
  background-color: #409eff;
  margin-bottom: 20px;
}
</style>
