<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'

const newPostParams: Ref<{ title: string; content: string }> = ref({
  title: '',
  content: '',
})
const formRef = ref<FormInstance>()
const rules = {
  title: [{ required: true, message: 'Please enter the post title', trigger: 'blur' }],
  content: [{ required: true, message: 'Please enter the post content', trigger: 'blur' }],
}
</script>

<template>
  <el-form ref="formRef" :model="newPostParams" :rules="rules" label-position="top">
    <el-form-item label="Title" prop="title">
      <el-input v-model="newPostParams.title" placeholder="Enter the post title" />
    </el-form-item>
    <el-form-item label="Content" prop="content">
      <el-input
        v-model="newPostParams.content"
        :rows="20"
        placeholder="Enter the post content"
        type="textarea"
      />
    </el-form-item>
    <el-form-item>
      <div style="display: flex; justify-content: flex-end; width: 100%">
        <el-button type="primary">Post</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
