<script lang="ts" setup>
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'

const commentContent = ref('')
</script>
<template>
  <div class="comment-form-container">
    <!-- Identity button -->
    <el-button class="identity-button">
      <el-icon class="identity-icon">
        <User />
      </el-icon>
      Get Identity
    </el-button>

    <!-- Comment input textarea -->
    <el-input
      v-model="commentContent"
      :rows="4"
      class="comment-textarea"
      placeholder="Enter your comment here"
      resize="none"
      type="textarea"
    />

    <!-- Submit button -->
    <el-button :disabled="!commentContent.trim()" class="submit-button" type="primary">
      Post Comment
    </el-button>
  </div>
</template>

<style scoped>
.identity-button {
  width: 100%;
  margin-bottom: 15px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.identity-icon {
  margin-right: 5px;
}

.comment-textarea {
  margin-bottom: 15px;
  border-radius: 4px;
}

.submit-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
  font-weight: normal;
  border-radius: 4px;
  background-color: #409eff;
  margin-bottom: 20px;
}
</style>
