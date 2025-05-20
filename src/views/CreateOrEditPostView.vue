<script lang="ts" setup>
import TopNavigation from '@/components/TopNavigation.vue'
import PageFooter from '@/components/PageFooter.vue'
import CreateOrEditPost from '@/components/CreateOrEditPost.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'
import { postApi } from '@/api/post.ts'
import type { Article } from '@/types'

const { postId } = defineProps<{
  postId?: string
}>()

const post: Ref<Article | undefined> = ref()

const authStore = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => authStore.isLoggedIn)
watch(isLoggedIn, (value: boolean) => {
  if (!value) {
    router.push({ path: '/' })
  }
})
onMounted(async () => {
  if (!isLoggedIn.value) {
    await router.push({ path: '/' })
    return
  }
  if (postId) {
    post.value = await postApi.getPostById(postId)
  }
})
</script>

<template>
  <el-container>
    <el-header style="padding: 0">
      <TopNavigation />
    </el-header>
    <el-main style="min-height: 90dvh">
      <CreateOrEditPost
        v-if="!!post"
        :content-in="post.content"
        :post-id="postId"
        :title-in="post.title"
        :tags-in="post.tags"
        style="max-width: 90%; margin: 40px auto 0 auto"
      />
      <CreateOrEditPost v-else style="max-width: 90%; margin: 40px auto 0 auto" />
    </el-main>
    <el-footer style="padding: 0">
      <PageFooter />
    </el-footer>
  </el-container>
</template>

<style scoped></style>
