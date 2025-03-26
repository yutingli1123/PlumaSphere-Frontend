<script setup lang="ts">

</script>

<template>
  <el-row class="top-nav" justify="space-between">
    <RouterLink to="/" class="blog-title">PlumaSphere</RouterLink>
  </el-row>
</template>

<style scoped>
@font-face {
  font-family: 'AlimamaShuHeiTi';
  src: url('@/assets/fonts/AlimamaShuHeiTi-Bold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
}

.top-nav {
  background: linear-gradient(to left, #bfbfbf, #8c8c8c);
  height: 150px;
  align-items: end;
}

.blog-title {
  align-self: center;
  margin-left: 60px;
  font-size: 48px;
  font-weight: bold;
  font-family: 'AlimamaShuHeiTi', sans-serif;
  color: #333333;
  text-decoration: none;
}
</style>
