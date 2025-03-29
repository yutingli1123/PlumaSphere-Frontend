<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
</script>

<template>
  <div class="top-navigation">
    <div class="title-section">
      <RouterLink to="/" class="main-title">PlumaSphere</RouterLink>
      <p class="subtitle">Another Blog Application</p>
    </div>
    <div class="search-login-section">
      <el-input
        class="search-input"
        placeholder="Search..."
        :prefix-icon="Search"
      />
      <el-button type="primary" class="login-button">Login</el-button>
    </div>
  </div>
</template>

<style scoped>
.top-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
  border-bottom: 1px solid #eaeaea;
  background-color: white;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
  text-decoration: none;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.search-login-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 240px;
}

.login-button {
  font-weight: normal;
}
</style>
