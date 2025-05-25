<script lang="ts" setup>
import { tagTypes } from '@/constant'
import { DateTime } from 'luxon'
import type { Article } from '@/types'

defineProps<{
  article: Article
}>()
</script>

<template>
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
</template>

<style scoped>
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
  overflow-wrap: break-word;
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

.router-link {
  text-decoration: none;
  color: inherit;
}
</style>
