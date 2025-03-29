<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'
import { ref } from 'vue'

const tags = ref([
  { name: 'JavaScript', count: '99+', tagType: '' },
  { name: 'TypeScript', count: '99+', tagType: 'success' },
  { name: 'Vue3', count: '99+', tagType: 'warning' },
  { name: 'Node.js', count: '99+', tagType: '' },
  { name: 'Spring Boot', count: '99+', tagType: 'danger' },
])
</script>

<template>
  <el-container>
    <el-header style="padding: 0; height: 71px">
      <TopNavigation />
    </el-header>
    <el-main>
      <el-container>
        <el-aside class="tag-sidebar" width="280px">
          <h3 class="tag-title">Tags</h3>
          <el-menu v-for="(tag, index) in tags" :key="index" class="tag-menu">
            <el-menu-item class="tag-item">
              <span>{{ tag.name }}</span>
              <el-tag size="small" :type="tag.tagType" class="tag-count">{{ tag.count }}</el-tag>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main></el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<style scoped>
.tag-sidebar {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
}

.tag-title {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

.tag-menu {
  font-size: 16px;
  --el-menu-border-color: transparent;
}

.tag-item {
  display: flex;
  margin-left: -8px;
  justify-content: space-between;
  align-items: center;
}

.tag-count {
  font-size: 12px;
}

/* 文章列表样式 */
.article-list {
  flex: 1;
}

.article-card {
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-image img {
  width: 100%;
  border-radius: 4px;
  max-height: 300px;
  object-fit: cover;
}

.article-title {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
}

.article-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.6;
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
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
