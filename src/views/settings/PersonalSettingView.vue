<script lang="ts" setup>
import { onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user.ts'
import { ApiEndpoint, getFullPath } from '@/api/endpoints.ts'
import { useAuthStore } from '@/stores/auth.ts'

const userStore = useUserStore()
const authStore = useAuthStore()
const formData = ref({
  nickname: '',
  bio: '',
  dob: '',
})

const initialFormData = ref({ nickname: '', bio: '', dob: '' })

const rules: FormRules = {
  nickname: [{ required: true, message: 'Title is required', trigger: 'blur' }],
  bio: [{ required: false, trigger: 'blur' }],
  dob: [{ required: false, type: 'date', trigger: 'change' }],
}

const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const avatarUrl = ref('')
const uploadDialogVisible = ref(false)

const submitChanges = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
    }
  })
}

const isChanged = computed(() => {
  return (
    formData.value.nickname !== initialFormData.value.nickname ||
    formData.value.bio !== initialFormData.value.bio ||
    formData.value.dob !== initialFormData.value.dob
  )
})

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('Only image files are allowed.')
  }
  return isImage
}

const finishUpdateAvatar = () => {
  uploadDialogVisible.value = false
  userStore.fetchUserInfo()
}

onMounted(async () => {
  const user = await userStore.getUserInfo()
  formData.value.nickname = user?.nickname ?? ''
  formData.value.bio = user?.bio ?? ''
  formData.value.dob = user?.dob ?? ''
  avatarUrl.value = user?.avatarUrl ?? ''
  initialFormData.value = { ...formData.value }
})
</script>

<template>
  <el-dialog v-model="uploadDialogVisible" center destroy-on-close show-close title="Upload Avatar">
    <el-upload
      :action="getFullPath(ApiEndpoint.USER_UPLOAD_AVATAR)"
      :before-upload="beforeUpload"
      :headers="{
        Authorization: `Bearer ${authStore.getAccessToken}`,
      }"
      :on-success="finishUpdateAvatar"
      :show-file-list="false"
      class="avatar-uploader"
      drag
      method="put"
    >
      <el-icon class="el-icon--upload">
        <i-ep-upload-filled />
      </el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
    </el-upload>
  </el-dialog>
  <div class="system-setting-view">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="2" class="avatar-col">
          <el-link underline="never" @click="uploadDialogVisible = true">
            <el-avatar :src="avatarUrl" style="width: 120px; height: 120px" />
          </el-link>
        </el-col>
        <el-col :span="20">
          <el-form-item label="Nickname" prop="nickname">
            <el-input v-model="formData.nickname" placeholder="Enter your nickname" />
          </el-form-item>
          <el-form-item label="Biography" prop="bio">
            <el-input v-model="formData.bio" placeholder="Enter your biography" />
          </el-form-item>
          <el-form-item label="Date of Birth" prop="dob">
            <el-date-picker v-model="formData.dob" />
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
        </el-col>
      </el-row>
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

.avatar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0 40px 0 20px;
}
</style>
