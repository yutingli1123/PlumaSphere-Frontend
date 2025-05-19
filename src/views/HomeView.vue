<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'
import TagSidebar from '@/components/TagSidebar.vue'
import PostList from '@/components/PostList.vue'
import PageFooter from '@/components/PageFooter.vue'
import type { Article, Tag } from '@/types'
import { postApi } from '@/api/post.ts'
import { tagApi } from '@/api/tag.ts'

const currentPage: Ref<number> = ref(1)
const totalPostPages: Ref<number> = ref(0)
const totalPostCount: Ref<number> = ref(0)
const loaded: Ref<boolean> = ref(false)
const activeTag: Ref<string | undefined> = ref()

const tags: Ref<Tag[] | undefined> = ref()
const articles: Ref<Article[] | undefined> = ref()

const refreshArticles = async () => {
  if (activeTag.value) {
    totalPostPages.value = await postApi.getPostPageCountByTag(activeTag.value)
    totalPostCount.value = await postApi.getPostCountByTag(activeTag.value)
    articles.value = await postApi.getAllPostsByTag(activeTag.value, 0)
  } else {
    totalPostPages.value = await postApi.getPostPages()
    totalPostCount.value = await postApi.getPostCount()
    articles.value = await postApi.getAllPosts(0)
  }
}

const refreshTags = async () => {
  tags.value = await tagApi.getAllTags()
}

const refreshContent = async () => {
  await Promise.all([refreshArticles(), refreshTags()])
  loaded.value = true
}

const getArticles = async (page: number) => {
  if (activeTag.value) {
    articles.value = await postApi.getAllPostsByTag(activeTag.value, page - 1)
  } else {
    articles.value = await postApi.getAllPosts(page - 1)
  }
}

const handleTagClick = async (tagName: string) => {
  currentPage.value = 1
  if (activeTag.value === tagName) {
    activeTag.value = undefined
  } else {
    activeTag.value = tagName
  }

  await refreshContent()
}

onMounted(() => {
  refreshContent()
})
</script>

<template>
  <el-container>
    <el-header style="padding: 0; height: 71px">
      <TopNavigation />
    </el-header>
    <el-main v-if="loaded">
      <el-container>
        <el-aside width="280px" style="padding-right: 14px">
          <TagSidebar :activeTag="activeTag" :tags="tags" @tagClick="handleTagClick" />
        </el-aside>
        <el-main style="padding-top: 10px">
          <PostList :articles="articles" :refresh="refreshContent" />
          <el-pagination
            v-if="totalPostPages !== 0"
            v-model:current-page="currentPage"
            layout="prev, pager, next, total, jumper"
            :page-count="totalPostPages"
            :total="totalPostCount"
            style="justify-content: center"
            @update:current-page="getArticles"
          />
        </el-main>
      </el-container>
    </el-main>
    <el-main v-else style="min-height: 85dvh; width: 90%; margin: 20px auto 0 auto">
      <!--      <el-skeleton animated :rows="10" />-->
    </el-main>
    <el-footer style="padding: 0">
      <PageFooter />
    </el-footer>
  </el-container>
</template>

<style scoped></style>
