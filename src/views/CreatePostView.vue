<script lang="ts" setup>
import TopNavigation from '@/components/TopNavigation.vue'
import PageFooter from '@/components/PageFooter.vue'
import NewPost from '@/components/NewPost.vue'
import { computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => authStore.isLoggedIn)
watch(isLoggedIn, (value: boolean) => {
  if (!value) {
    router.push({ path: '/' })
  }
})
onMounted(() => {
  if (!isLoggedIn.value) {
    router.push({ path: '/' })
  }
})
</script>

<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNavigation />
    </el-header>
    <el-main style="min-height: 90dvh">
      <NewPost style="max-width: 90%; margin: 40px auto 0 auto" />
    </el-main>
    <el-footer style="padding: 0">
      <PageFooter />
    </el-footer>
  </el-container>
</template>

<style scoped></style>
