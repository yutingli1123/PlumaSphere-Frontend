<script lang="ts" setup>
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import { User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user.ts'
import type { User as UserInfo } from '@/types'
import { useAuthStore } from '@/stores/auth.ts'

const commentContent = ref('')
const userStore = useUserStore()
const authStore = useAuthStore()
const userInfo: Ref<UserInfo | undefined | null> = ref()
const loadingIdentity: Ref<boolean> = ref(false)

const getNewIdentity = async () => {
  loadingIdentity.value = true
  await authStore.getNewIdentity()
  await refreshUserInfo()
  loadingIdentity.value = false
}

const refreshUserInfo = async () => {
  userInfo.value = await userStore.getUserInfo
}

const hasToken = computed(() => authStore.hasToken)
const isLoggedIn = computed(() => authStore.isLoggedIn)

watch([hasToken, isLoggedIn], async () => {
  await refreshUserInfo()
})

onMounted(() => {
  refreshUserInfo()
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
        <User />
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
    <el-button :disabled="!commentContent.trim() || !userInfo" class="submit-button" type="primary">
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
