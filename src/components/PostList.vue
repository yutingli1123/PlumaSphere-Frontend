<script lang="ts" setup>
import type { Article } from '@/types'
import { DateTime } from 'luxon'
import { tagTypes } from '@/constant'

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
      <router-link :to="`/posts/${article.id}`" class="router-link">
        <div class="article-content-part">
          <div class="article-content">
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-description">{{ article.description }}</p>

            <div class="article-meta">
              <div class="article-tags">
                <el-tag
                  v-for="(tag, tagIndex) in article.tags"
                  :key="tagIndex"
                  :type="tagTypes[tagIndex % tagTypes.length]"
                  class="article-tag"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </div>

              <div class="article-date">
                <el-icon>
                  <IEpCalendar />
                </el-icon>
                <span>{{
                  DateTime.fromISO(article.createdAt)
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </el-card>
  </div>
</template>

<style scoped>
.article-card {
  margin-bottom: 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.router-link {
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
