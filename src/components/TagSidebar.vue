<script lang="ts" setup>
interface Tag {
  name: string
  count: string
  tagType: string
}

defineProps<{
  tags: Tag[] | undefined
}>()
</script>

<template>
  <div class="tag-sidebar">
    <h3 class="tag-title">Tags</h3>
    <el-menu v-for="(tag, index) in tags" :key="index" class="tag-menu">
      <el-menu-item class="tag-item">
        <span>{{ tag.name }}</span>
        <el-tag :type="tag.tagType" class="tag-count" size="small">{{ tag.count }}</el-tag>
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
