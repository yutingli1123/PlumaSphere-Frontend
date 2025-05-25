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
const searchQuery = ref('')

const navigateToCreatePost = () => {
  router.push({ path: '/create-post' })
}

const title = computed(() => configStore.getConfig(ConfigFiled.BLOG_TITLE) ?? undefined)
const subtitle = computed(() => configStore.getConfig(ConfigFiled.BLOG_SUBTITLE) ?? undefined)

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  await router.push({
    path: '/search',
    query: { q: searchQuery.value.trim() },
  })
  searchQuery.value = ''
}

const handleKeyPress = (event: Event | KeyboardEvent) => {
  if ('key' in event && event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="top-navigation">
    <div class="title-section">
      <RouterLink class="main-title" to="/">{{ title }}</RouterLink>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
    <div class="search-login-section">
      <el-input
        v-model="searchQuery"
        :prefix-icon="IEpSearch"
        class="search-input"
        clearable
        placeholder="Search..."
        @keydown="handleKeyPress"
      >
        <template #suffix>
          <el-button
            v-if="searchQuery.trim()"
            size="small"
            style="font-weight: bold"
            text
            type="primary"
            @click="handleSearch"
            >Search
          </el-button>
        </template>
      </el-input>
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

/*noinspection CssUnusedSymbol*/
.search-input :deep(.el-input__wrapper) {
  transition: all 0.3s ease;
  border-radius: 20px;
  border: 1px solid #eaeaea;
  box-shadow: none;
  padding: 0 16px;
  background: #fafafa;
}

/*noinspection CssUnusedSymbol*/
.search-input :deep(.el-input__wrapper:hover) {
  border-color: #e0e0e0;
  background: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/*noinspection CssUnusedSymbol*/
.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}
</style>
