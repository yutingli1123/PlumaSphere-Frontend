<script lang="ts" setup>
import { useConfigStore } from '@/stores/config.ts'
import { ConfigFiled } from '@/constant'
import { systemApi } from '@/api/system.ts'
import type { FormInstance } from 'element-plus'

// refs
const configStore = useConfigStore()
const formData = ref({
  blogTitle: '',
  blogSubtitle: '',
  pageSize: 5,
})

const initialFormData = ref({ blogTitle: '', blogSubtitle: '', pageSize: 5 })

const formRef = ref<FormInstance>()
const submitLoading = ref(false)

// rules
const rules = {
  blogTitle: [{ required: true, message: 'Title is required', trigger: 'blur' }],
  blogSubtitle: [{ required: true, message: 'Subtitle is required', trigger: 'blur' }],
  pageSize: [{ required: true, message: 'Page size is required', trigger: 'change' }],
}

// submit changes function
const submitChanges = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      await systemApi.updateSettings([
        {
          configKey: ConfigFiled.BLOG_TITLE,
          configValue: formData.value.blogTitle,
        },
        {
          configKey: ConfigFiled.BLOG_SUBTITLE,
          configValue: formData.value.blogSubtitle,
        },
        {
          configKey: ConfigFiled.PAGE_SIZE,
          configValue: formData.value.pageSize.toString(),
        },
      ])
      await configStore.refreshConfig()
      initialFormData.value = { ...formData.value }
      submitLoading.value = false
    }
  })
}

// check if any field is changed
const isChanged = computed(() => {
  return (
    formData.value.blogTitle !== initialFormData.value.blogTitle ||
    formData.value.blogSubtitle !== initialFormData.value.blogSubtitle ||
    formData.value.pageSize !== initialFormData.value.pageSize
  )
})

// on mounted
onMounted(async () => {
  if (!configStore.loaded) {
    await configStore.initialConfig()
  }
  formData.value.blogTitle = configStore.getConfig(ConfigFiled.BLOG_TITLE) ?? ''
  formData.value.blogSubtitle = configStore.getConfig(ConfigFiled.BLOG_SUBTITLE) ?? ''
  formData.value.pageSize = parseInt(configStore.getConfig(ConfigFiled.PAGE_SIZE) ?? '5')
  initialFormData.value = { ...formData.value }
})
</script>

<template>
  <div class="system-setting-view">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="90px">
      <el-form-item label="Title" prop="blogTitle">
        <el-input v-model="formData.blogTitle" placeholder="Enter blog title" />
      </el-form-item>
      <el-form-item label="Subtitle" prop="blogSubtitle">
        <el-input v-model="formData.blogSubtitle" placeholder="Enter blog subtitle" />
      </el-form-item>
      <el-form-item label="Page Size" prop="pageSize">
        <el-input-number v-model="formData.pageSize" :max="50" :min="1" />
        <el-text style="margin-left: 60px" type="info">
          Changes to page size will take effect after the backend restarts.
        </el-text>
      </el-form-item>
      <el-form-item>
        <div class="save-button">
          <el-button
            :disabled="!isChanged"
            :loading="submitLoading"
            type="primary"
            @click="submitChanges"
            >Save
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.system-setting-view {
  margin: 20px 0 0 20px;
  max-width: 800px;
}

.save-button {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
