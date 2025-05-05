<script lang="ts" setup>
import type { Tag } from '@/types'

defineProps<{
  tags: Tag[] | undefined
}>()

const tagTypes = ['', 'success', 'warning', 'danger', 'info']
</script>

<template>
  <div class="tag-sidebar">
    <h3 class="tag-title">Tags</h3>
    <div v-if="tags === undefined">
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
  </div>
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
</style>
