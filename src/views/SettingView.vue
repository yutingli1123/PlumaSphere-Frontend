<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

watch(
  () => authStore.isLoggedIn(),
  (isLoggedIn) => {
    if (!isLoggedIn) {
      router.push({ path: '/' })
    }
  },
)

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/settings') {
      router.replace('/settings/system')
    }
  },
)

onMounted(() => {
  if (!authStore.isLoggedIn()) {
    router.push({ path: '/' })
    return
  }
  if (route.path === '/settings') {
    router.replace('/settings/system')
  }
})
</script>

<template>
  <TopNavigation />
  <el-container class="main-container">
    <el-aside>
      <el-menu :default-active="route.path" class="menu" router>
        <el-menu-item index="/settings/system">
          <el-icon>
            <i-ep-operation />
          </el-icon>
          System Settings
        </el-menu-item>
        <el-menu-item index="/settings/personal">
          <el-icon>
            <i-ep-user />
          </el-icon>
          Personal Info
        </el-menu-item>
        <el-menu-item index="/settings/user-management">
          <el-icon>
            <i-ep-stamp />
          </el-icon>
          User Management
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
  <PageFooter />
</template>

<style scoped>
.main-container {
  min-height: 85dvh;
}

.menu {
  min-height: 85dvh;
}
</style>
