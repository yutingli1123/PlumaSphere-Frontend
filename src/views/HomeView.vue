<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'
import { onMounted, type Ref, ref } from 'vue'
import TagSidebar from '@/components/TagSidebar.vue'
import ArticleList from '@/components/ArticleList.vue'
import PageFooter from '@/components/PageFooter.vue'
import type { Article, Tag } from '@/types'
import { postApi } from '@/api/post.ts'
import { tagApi } from '@/api/tag.ts'

const currentPage: Ref<number> = ref(1)
const totalPosts: Ref<number> = ref(0)

const tags: Ref<Tag[] | undefined> = ref()
const articles: Ref<Article[] | undefined> = ref()

const getArticles = async () => {
  articles.value = await postApi.getAllPosts()
}

const getTags = async () => {
  tags.value = await tagApi.getAllTags()
}

const refreshContent = async () => {
  await Promise.all([getArticles(), getTags()])
  if (articles.value) {
    totalPosts.value = articles.value.length
  }
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
    <el-main>
      <el-container>
        <el-aside width="280px" style="padding-right: 14px">
          <TagSidebar :tags="tags" />
        </el-aside>
        <el-main style="padding-top: 10px">
          <ArticleList :articles="articles" :refresh="refreshContent" />
          <el-pagination
            v-if="totalPosts != 0"
            v-model:current-page="currentPage"
            layout="prev, pager, next, total, jumper"
            :total="totalPosts"
            :page-size="5"
            style="justify-content: center"
          />
        </el-main>
      </el-container>
    </el-main>
    <el-footer style="padding: 0">
      <PageFooter />
    </el-footer>
  </el-container>
</template>

<style scoped></style>
