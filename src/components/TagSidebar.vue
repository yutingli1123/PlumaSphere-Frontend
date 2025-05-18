<script lang="ts" setup>
import type { Tag } from '@/types'
import { tagTypes } from '@/constant'

defineProps<{
  tags: Tag[] | undefined
}>()
</script>

<template>
  <el-card class="tag-sidebar">
    <h3 class="tag-title">Tags</h3>
    <div v-if="!tags || tags.length === 0">
      <el-empty :image-size="100" />
    </div>
    <el-menu v-for="(tag, index) in tags" :key="index" class="tag-menu">
      <el-menu-item class="tag-item">
        <span>{{ tag.name }}</span>
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
  display: flex;
  margin-left: -8px;
  justify-content: space-between;
  align-items: center;
}

.tag-count {
  font-size: 12px;
}
</style>
