<script setup lang="ts">
import LoginDialog from '@/components/LoginDialog.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'
import IEpSearch from '~icons/ep/search'
import { ConfigFiled, useConfigStore } from '@/stores/config.ts'

const authStore = useAuthStore()
const configStore = useConfigStore()
const router = useRouter()

const loginDialogVisible = ref(false)
const isLoggedIn = computed(() => authStore.isLoggedIn)

const navigateToCreatePost = () => {
  router.push({ path: '/create-post' })
}

const title = computed(() => configStore.getConfig(ConfigFiled.BLOG_TITLE) ?? 'PlumaSphere')
const subtitle = computed(
  () => configStore.getConfig(ConfigFiled.BLOG_SUBTITLE) ?? 'Another Blog Application',
)
</script>

<template>
  <div class="top-navigation">
    <div class="title-section">
      <RouterLink class="main-title" to="/">{{ title }}</RouterLink>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
    <div class="search-login-section">
      <el-input :prefix-icon="IEpSearch" class="search-input" placeholder="Search..." />
      <el-button
        v-if="!isLoggedIn"
        class="login-button"
        type="primary"
        @click="loginDialogVisible = true"
        >Login
      </el-button>
      <div v-else>
        <el-button type="primary" @click="navigateToCreatePost">New Post</el-button>
        <el-button class="login-button" type="danger" @click="authStore.logout()"
          >Logout
        </el-button>
      </div>
    </div>
  </div>

  <LoginDialog v-model:visible="loginDialogVisible" />
</template>

<style scoped>
.top-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  border-bottom: 1px solid #eaeaea;
  background-color: white;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin: 0;
  text-decoration: none;
}

.subtitle {
  font-size: 14px;
  color: #666666;
  margin: 0;
}

.search-login-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 240px;
}

.login-button {
  font-weight: normal;
}
</style>
