<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'
import TagSidebar from '@/components/TagSidebar.vue'
import PostList from '@/components/PostList.vue'
import PageFooter from '@/components/PageFooter.vue'
import type { Article, Tag } from '@/types'
import { postApi } from '@/api/post.ts'
import { tagApi } from '@/api/tag.ts'

const currentPage: Ref<number> = ref(1)
const totalPosts: Ref<number> = ref(0)
const loaded: Ref<boolean> = ref(false)

const tags: Ref<Tag[] | undefined> = ref()
const articles: Ref<Article[] | undefined> = ref()

const refreshArticles = async () => {
  totalPosts.value = await postApi.getPostsCount()
  articles.value = await postApi.getAllPosts(0)
}

const refreshTags = async () => {
  tags.value = await tagApi.getAllTags()
}

const refreshContent = async () => {
  await Promise.all([refreshArticles(), refreshTags()])
  loaded.value = true
}

const getArticles = async (page: number) => {
  articles.value = await postApi.getAllPosts(page - 1)
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
          <TagSidebar :tags="tags" />
        </el-aside>
        <el-main style="padding-top: 10px">
          <PostList :articles="articles" :refresh="refreshContent" />
          <el-pagination
            v-if="totalPosts !== 0"
            v-model:current-page="currentPage"
            layout="prev, pager, next, total, jumper"
            :total="totalPosts"
            :page-size="5"
            style="justify-content: center"
            @current-change="getArticles"
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
