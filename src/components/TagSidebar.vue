<script lang="ts" setup>
import type { Tag } from '@/types'
import { tagTypes } from '@/constant'

defineProps<{
  tags?: Tag[]
  activeTag?: string
}>()

const emit = defineEmits<{
  (e: 'tagClick', tagName: string): void
}>()

const handleTagClick = (tagName: string) => {
  emit('tagClick', tagName)
}
</script>

<template>
  <el-card class="tag-sidebar">
    <h3 class="tag-title">Tags</h3>
    <div v-if="!tags || tags.length === 0">
      <el-empty :image-size="100" />
    </div>
    <el-menu class="tag-menu">
      <el-menu-item
        v-for="(tag, index) in tags"
        :key="index"
        :class="{ 'active-tag': tag.name === activeTag }"
        class="tag-item"
        @click="handleTagClick(tag.name)"
      >
        <span class="tag-name">{{ tag.name }}</span>
        <el-tag :type="tagTypes[index % tagTypes.length]" class="tag-count" size="small"
          >{{ tag.postCount }}
        </el-tag>
      </el-menu-item>
    </el-menu>
  </el-card>
</template>

<style scoped>
.tag-sidebar {
  margin-top: 10px;
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
  white-space: normal !important;
  line-height: 1.2;
  display: flex;
  margin-left: -8px;
  justify-content: space-between;
  align-items: center;
}

.tag-name {
  word-break: break-word;
  padding-right: 10px;
}

.active-tag {
  font-weight: bold;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-left: 3px solid var(--el-color-primary);
}

.tag-count {
  font-size: 12px;
}
</style>
