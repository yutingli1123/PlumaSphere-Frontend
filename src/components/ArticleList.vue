<script lang="ts" setup>
import { Calendar } from '@element-plus/icons-vue'
import type { Article } from '@/types'

defineProps<{
  articles: Article[] | undefined
  refresh: () => void
}>()
</script>

<template>
  <div style="min-height: 80dvh">
    <div v-if="articles === undefined">
      <el-card>
        <el-empty :image-size="100">
          <template #description>
            <p>No Article</p>
          </template>
          <el-button :onclick="refresh" type="primary">Refresh</el-button>
        </el-empty>
      </el-card>
    </div>
    <router-link
      v-for="(article, index) in articles"
      :key="index"
      :to="`/articles/${article.id}`"
      class="article-card"
    >
      <div class="article-content-part">
        <div class="article-content">
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-description">{{ article.description }}</p>

          <div class="article-meta">
            <div class="article-tags">
              <el-tag
                v-for="(tag, tagIndex) in article.tags"
                :key="tagIndex"
                :type="tag.name"
                class="article-tag"
                size="small"
              >
                {{ tag.name }}
              </el-tag>
            </div>

            <div class="article-date">
              <el-icon>
                <Calendar />
              </el-icon>
              <span>{{ article.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.article-card {
  margin-bottom: 20px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
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

.article-content-part {
  padding: 20px;
}

.article-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
}

.article-description {
  color: #666666;
  margin-bottom: 20px;
  line-height: 24px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-tags {
  display: flex;
  gap: 8px;
}

.article-date {
  color: #999999;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
