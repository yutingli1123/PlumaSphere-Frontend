<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'
import { ref } from 'vue'
import TagSidebar from '@/components/TagSidebar.vue'
import ArticleList from '@/components/ArticleList.vue'
import PageFooter from '@/components/PageFooter.vue'

const tags = ref([
  { name: 'JavaScript', count: '99+', tagType: '' },
  { name: 'TypeScript', count: '99+', tagType: 'success' },
  { name: 'Vue3', count: '99+', tagType: 'warning' },
  { name: 'Node.js', count: '99+', tagType: '' },
  { name: 'Spring Boot', count: '99+', tagType: 'danger' },
  { name: 'Frontend', count: '99+', tagType: 'info' },
])

const articles = ref([
  {
    title: 'Article 1',
    description:
      'Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description',
    tags: [
      { name: 'Vue3', type: 'warning' },
      { name: 'JavaScript', type: '' },
      { name: 'Frontend', type: 'info' },
    ],
    date: '2025-03-29',
    image: null,
  },
  {
    title: 'Article 2',
    description:
      'Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description',
    tags: [
      { name: 'Spring Boot', type: 'danger' },
      { name: 'Frontend', type: 'info' },
    ],
    date: '2025-03-28',
    image: null,
  },
  {
    title: 'Article 3',
    description:
      'Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description',
    tags: [
      { name: 'Vue3', type: 'warning' },
      { name: 'JavaScript', type: '' },
    ],
    date: '2025-03-27',
    image: 'template-img.png',
  },
  {
    title: 'Article 4',
    description:
      'Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description',
    tags: [
      { name: 'TypeScript', type: 'success' },
      { name: 'Frontend', type: 'info' },
    ],
    date: '2025-03-26',
    image: null,
  },
  {
    title: 'Article 5',
    description:
      'Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description',
    tags: [{ name: 'Node.js', type: '' }],
    date: '2025-03-25',
    image: null,
  },
])
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
          <ArticleList :articles="articles" />
          <el-pagination
            layout="prev, pager, next, total, jumper"
            :total="50"
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
