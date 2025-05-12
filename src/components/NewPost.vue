<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { postApi } from '@/api/post.ts'
import type { Article } from '@/types'
import { useRouter } from 'vue-router'

const posting = ref(false)
const router = useRouter()

const newPostParams: Ref<{ title: string; content: string }> = ref({
  title: '',
  content: '',
})
const formRef = ref<FormInstance>()
const rules = {
  title: [{ required: true, message: 'Please enter the post title', trigger: 'blur' }],
  content: [{ required: true, message: 'Please enter the post content', trigger: 'blur' }],
}

const createPost = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      posting.value = true
      const post: Article = {
        id: null,
        title: newPostParams.value.title,
        content: newPostParams.value.content,
        description: null,
        authorId: null,
        tags: [],
        createdAt: null,
        updatedAt: null,
      }
      await postApi.createPost(post)
      newPostParams.value.title = ''
      newPostParams.value.content = ''
      posting.value = false
      await router.push({ path: '/' })
    }
  })
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
        <el-button :loading="posting" type="primary" @click="createPost">Post</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
