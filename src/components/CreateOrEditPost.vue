<script lang="ts" setup>
import type { FormInstance } from 'element-plus'
import { postApi } from '@/api/post.ts'
import type { ArticleRequest, ArticleUpdateRequest, Tag } from '@/types'
import { useRouter } from 'vue-router'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { onBeforeUnmount } from 'vue'
import { tagApi } from '@/api/tag.ts'
import { tagTypes } from '@/constant'

const editor = ref<Vditor | undefined>()
const allTags = ref<Tag[] | undefined>()

const posting = ref(false)
const router = useRouter()
const { titleIn, contentIn, postId, tagsIn } = defineProps<{
  titleIn?: string
  contentIn?: string
  postId?: string
  tagsIn?: string[]
}>()

const isEditing = computed(() => !!postId)

const newPostParams: Ref<{ title: string; tags: string[]; content: string }> = ref({
  title: '',
  tags: [],
  content: '',
})
const formRef = ref<FormInstance>()
const rules = {
  title: [{ required: true, message: 'Please enter the post title', trigger: 'blur' }],
  content: [{ required: true, message: 'Please enter the post content', trigger: 'blur' }],
}

const loadAllTags = async () => {
  allTags.value = await tagApi.getAllTags()
}

const handleTagSelect = (tagName: string) => {
  if (!newPostParams.value.tags.includes(tagName)) {
    newPostParams.value.tags.push(tagName)
  } else {
    newPostParams.value.tags = newPostParams.value.tags.filter((tag) => tag !== tagName)
  }
}

const submitPost = () => {
  if (editor.value) {
    newPostParams.value.content = editor.value.getValue()
  }

  formRef.value?.validate(async (valid) => {
    if (valid) {
      posting.value = true

      if (isEditing && !!postId) {
        const post: ArticleUpdateRequest = {
          id: postId,
          title: newPostParams.value.title,
          content: newPostParams.value.content,
          tags: newPostParams.value.tags,
        }
        await postApi.updatePost(post)
      } else {
        const post: ArticleRequest = {
          title: newPostParams.value.title,
          content: newPostParams.value.content,
          tags: newPostParams.value.tag,
        }
        await postApi.createPost(post)
      }
      newPostParams.value.title = ''
      newPostParams.value.content = ''
      posting.value = false
      if (isEditing) {
        router.back()
      } else {
        await router.push({ path: '/' })
      }
    }
  })
}

onMounted(async () => {
  if (!!titleIn) {
    newPostParams.value.title = titleIn
  }
  if (!!contentIn) {
    newPostParams.value.content = contentIn
  }
  if (!!tagsIn) {
    newPostParams.value.tags = tagsIn
  }

  await loadAllTags()

  editor.value = new Vditor('editor', {
    lang: 'en_US',
    height: 600,
    width: '100%',
    after() {
      if (newPostParams.value.content) {
        editor.value?.setValue(newPostParams.value.content)
      }
    },
    input(value: string) {
      newPostParams.value.content = value
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <el-form ref="formRef" :model="newPostParams" :rules="rules" label-position="top">
    <el-form-item label="Title" prop="title">
      <el-input v-model="newPostParams.title" placeholder="Enter the post title" />
    </el-form-item>
    <el-form-item label="Tag">
      <div class="tags-container">
        <div class="tag-grid">
          <el-check-tag
            v-for="(tag, index) in allTags"
            :key="tag.name"
            :checked="newPostParams.tags.includes(tag.name)"
            :type="tagTypes[index % tagTypes.length]"
            class="selectable-tag"
            @click="handleTagSelect(tag.name)"
          >
            {{ tag.name }}
          </el-check-tag>
        </div>
      </div>
      <el-input-tag v-model:model-value="newPostParams.tags" />
    </el-form-item>
    <el-form-item label="Content" prop="content">
      <div id="editor" />
    </el-form-item>
    <el-form-item>
      <div style="display: flex; justify-content: flex-end; width: 100%">
        <el-button :loading="posting" type="primary" @click="submitPost"
          >{{ isEditing ? 'Edit' : 'Post' }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.tags-container {
  margin-bottom: 14px;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.selectable-tag {
  min-width: 30px;
}
</style>
