<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopNavigation from '@/components/TopNavigation.vue'
</script>

<template>
  <el-header style="padding: 0;">
    <TopNavigation />
  </el-header>
  <el-main>
    <RouterView />
  </el-main>
</template>

<style scoped></style>
