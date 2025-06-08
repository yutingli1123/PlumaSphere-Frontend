<script lang="ts" setup>
import type { Article } from '@/types'
import { useRouter } from 'vue-router'
import { postApi } from '@/api/post.ts'

const { query, page } = defineProps<{
  query: string
  page: number
}>()

const router = useRouter()

const loaded: Ref<boolean> = ref(false)
const posts: Ref<Article[]> = ref([])
const postsCount: Ref<number> = ref(0)
const postsPageCount: Ref<number> = ref(0)

const gotoPage = (newPage: number) => {
  router.push({
    name: 'search',
    query: { q: query, page: newPage },
  })
}

const fetchPosts = async (pageNum: number) => {
  if (!query) return
  posts.value = await postApi.getAllPostsBySearchQuery(query, pageNum - 1)
}

const search = async () => {
  if (!query) await router.push({ path: '/' })
  postsCount.value = await postApi.getPostCountBySearchQuery(query)
  postsPageCount.value = await postApi.getPostPageCountBySearchQuery(query)
  await fetchPosts(page)
}

watch(
  () => query,
  async () => {
    await search()
  },
)

watch(
  () => page,
  async () => {
    await fetchPosts(page)
  },
)

onMounted(async () => {
  await search()
  loaded.value = true
})
</script>

<template>
  <TopNavigation />
  <div class="main-container">
    <el-skeleton v-if="!loaded" :rows="20" animated class="skeleton" />
    <div v-if="loaded">
      <div v-if="query" class="search-container">
        <div class="search-header">
          <h2 class="search-title">Search Results</h2>
          <div class="search-info">
            <span class="search-label">Searching for:</span>
            <span class="search-keyword">"{{ query }}"</span>
            <span v-if="postsCount > 0" class="search-count">
              ({{ postsCount }} result{{ postsCount !== 1 ? 's' : '' }})
            </span>
          </div>
        </div>
      </div>
      <el-empty v-if="postsCount === 0 || posts.length === 0" description="No results found" />
      <PostList
        v-if="postsCount !== 0 && posts.length !== 0"
        :articles="posts"
        :refresh="() => {}"
        class="post-list"
      />
      <el-pagination
        v-if="postsCount !== 0"
        :current-page="page"
        :page-count="postsPageCount"
        :total="postsCount"
        class="pagination"
        layout="prev, pager, next, total, jumper"
        style="justify-content: center"
        @update:current-page="gotoPage"
      />
    </div>
  </div>
  <PageFooter />
</template>

<style scoped>
.search-container {
  padding: 24px;
  background: #e9ecef;
  color: #343a40;
  margin-bottom: 24px;
  border-bottom: 1px solid #dee2e6;
}

.search-header {
  max-width: 80%;
  margin: 0 auto;
}

.search-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #2c3e50;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.search-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 16px;
}

.search-label {
  color: #6c757d;
  font-weight: 500;
}

.search-keyword {
  background: #ffffff;
  color: #1e2952;
  padding: 8px 18px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 18px;
  border: 2px solid #e9ecef;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.search-keyword:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
  background: #f8f9fa;
  border-color: #dee2e6;
}

.search-count {
  color: #6c757d;
  font-style: italic;
  font-weight: 500;
}

.post-list {
  max-width: 80%;
  margin: 0 auto;
}

.pagination {
  margin-bottom: 40px;
}

.skeleton {
  margin: 40px auto;
  max-width: 80%;
}

.main-container {
  min-height: 85dvh;
}
</style>
