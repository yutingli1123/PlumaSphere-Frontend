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
  <TopNavigation />
  <div style="min-height: 80dvh">
    <CreateOrEditPost
      v-if="!!post"
      :content-in="post.content"
      :post-id="postId"
      :tags-in="post.tags"
      :title-in="post.title"
      style="max-width: 90%; margin: 40px auto 0 auto"
    />
    <CreateOrEditPost v-else style="max-width: 90%; margin: 40px auto 0 auto" />
  </div>
  <PageFooter />
</template>

<style scoped></style>
