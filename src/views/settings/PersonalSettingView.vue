<script lang="ts" setup>
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { useUserStore } from '@/stores/user.ts'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { userApi } from '@/api/user.ts'

// refs
const userStore = useUserStore()
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

const cropper = ref()
const currentImg = ref('')
const cropperLoading = ref(false)

// submit changes function
const submitChanges = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (
          await userApi.updateUserInfo({
            nickname: formData.value.nickname,
            bio: formData.value.bio,
            dob: formData.value.dob,
          })
        ) {
          await userStore.fetchUserInfo()
          await refreshUserInfo()
          ElMessage.success('Changes saved successfully')
        }
      } catch (error) {
        console.error('Update failed:', error)
        ElMessage.error('Failed to save changes')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// check if changed
const isChanged = computed(() => {
  return (
    formData.value.nickname !== initialFormData.value.nickname ||
    formData.value.bio !== initialFormData.value.bio ||
    formData.value.dob !== initialFormData.value.dob
  )
})

// handle image change
const handleImageChange = (data: UploadFile) => {
  if (!data.raw) {
    ElMessage.error('No image file selected')
    return
  }
  loadFile(data.raw)
    .then((res) => {
      currentImg.value = res
    })
    .catch((e) => {
      console.error(e)
      ElMessage.error('Failed to load image')
    })
}

// handle image upload
const handleImageUpload = (img: string) => {
  currentImg.value = img
}

// confirm crop
const confirmCrop = async () => {
  if (!cropper.value) {
    ElMessage.error('Cropper not initialized')
    return
  }

  cropperLoading.value = true
  try {
    cropper.value.getCropData((data: string) => {
      fetch(data)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
          return uploadAvatar(file)
        })
        .catch((error) => {
          console.error('Crop failed:', error)
          ElMessage.error('Crop failed')
        })
        .finally(() => {
          cropperLoading.value = false
        })
    })
  } catch (error) {
    console.error('Crop failed:', error)
    ElMessage.error('Crop failed')
    cropperLoading.value = false
  }
}

// upload avatar
const uploadAvatar = async (file: File) => {
  try {
    if (await userApi.updateAvatar(file)) {
      ElMessage.success('Avatar uploaded successfully')
      await finishUpdateAvatar()
    }
  } catch (error) {
    console.error('Upload avatar failed:', error)
    ElMessage.error('Avatar upload failed')
  }
}

// load file
const loadFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('File read failed'))
      }
    }
    reader.onerror = () => reject(new Error('File read error'))
    reader.readAsDataURL(file)
  })
}

// finish update avatar
const finishUpdateAvatar = async () => {
  uploadDialogVisible.value = false
  currentImg.value = ''
  await userStore.fetchUserInfo()
  await refreshUserInfo()
}

// refresh user info
const refreshUserInfo = async () => {
  const user = await userStore.getUserInfo()
  formData.value.nickname = user?.nickname ?? ''
  formData.value.bio = user?.bio ?? ''
  formData.value.dob = user?.dob ?? ''
  avatarUrl.value = user?.avatarUrl ?? ''
  initialFormData.value = { ...formData.value }
}

// on mounted
onMounted(async () => {
  await refreshUserInfo()
})
</script>

<template>
  <el-dialog
    v-model="uploadDialogVisible"
    center
    destroy-on-close
    show-close
    title="Upload Avatar"
    width="600px"
  >
    <div
      v-if="!currentImg"
      style="height: 400px; display: flex; align-items: center; justify-content: center"
    >
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        drag
        style="width: 100%"
        @change="handleImageChange"
      >
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">Drop image here or <em>click to upload</em></div>
      </el-upload>
    </div>

    <vue-cropper
      v-else
      ref="cropper"
      :autoCrop="true"
      :autoCropHeight="200"
      :autoCropWidth="200"
      :canMoveBox="false"
      :centerBox="true"
      :fixedBox="true"
      :img="currentImg"
      style="height: 400px"
      @img-upload="handleImageUpload"
    />

    <div class="cropper-controls" style="margin-top: 20px; text-align: center">
      <el-upload
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        style="display: inline-block; margin-right: 10px"
        @change="handleImageChange"
      >
      </el-upload>
      <el-button
        v-if="currentImg"
        :disabled="!currentImg"
        :loading="cropperLoading"
        type="success"
        @click="confirmCrop"
      >
        Confirm Upload
      </el-button>
      <el-button v-if="currentImg" @click="currentImg = ''"> Clear</el-button>
    </div>
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
            <el-date-picker v-model="formData.dob" type="date" value-format="YYYY-MM-DD" />
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
