<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'
import { ref } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import TagSidebar from '@/components/TagSidebar.vue'

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
          <router-link
            v-for="(article, index) in articles"
            :key="index"
            class="article-card"
            :to="`/articles/${index}`"
          >
            <div v-if="article.image" class="article-image">
              <img :src="article.image" :alt="article.title" />
            </div>

            <div class="article-content-part">
              <div class="article-content">
                <h2 class="article-title">{{ article.title }}</h2>
                <p class="article-description">{{ article.description }}</p>

                <div class="article-meta">
                  <div class="article-tags">
                    <el-tag
                      v-for="(tag, tagIndex) in article.tags"
                      :key="tagIndex"
                      size="small"
                      class="article-tag"
                      :type="tag.type"
                    >
                      {{ tag.name }}
                    </el-tag>
                  </div>

                  <div class="article-date">
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    <span>{{ article.date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
          <el-pagination
            layout="prev, pager, next, total, jumper"
            :total="50"
            :page-size="5"
            style="justify-content: center"
          />
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<style scoped>
.tag-sidebar {
  background-color: white;
  border-radius: 4px;
  padding: 24px;
  margin-top: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
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
  color: #666;
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
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
