<script lang="ts" setup>
import type { Article } from '@/types'
import PostContent from '@/components/PostContent.vue'

defineProps<{
  articles: Article[] | undefined
  refresh: () => void
}>()
</script>

<template>
  <div style="min-height: 80dvh">
    <div v-if="!articles || articles.length === 0">
      <el-card>
        <el-empty :image-size="100">
          <template #description>
            <p>No Article</p>
          </template>
          <el-button type="primary" @click="refresh">Refresh</el-button>
        </el-empty>
      </el-card>
    </div>
    <el-card v-for="(article, index) in articles" :key="index" class="article-card">
      <PostContent :article="article" />
    </el-card>
  </div>
</template>

<style scoped>
.article-card {
  margin-bottom: 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
}

.article-image img {
  width: 100%;
  border-radius: 4px 4px 0 0;
  max-height: 300px;
  object-fit: cover;
}
</style>
