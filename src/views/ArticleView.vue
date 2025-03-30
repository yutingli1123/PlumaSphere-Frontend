<script setup lang="ts">
import TopNavigation from '@/components/TopNavigation.vue'

defineProps({
  articleId: String,
})
</script>

<template>
  <el-container>
    <el-header style="padding: 0;">
      <TopNavigation />
    </el-header>
  </el-container>
</template>

<style scoped></style>
