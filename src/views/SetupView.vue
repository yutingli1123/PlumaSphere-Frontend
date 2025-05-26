<script lang="ts" setup>
import { systemApi } from '@/api/system.ts'
import type { InitSystemParams } from '@/types'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'
import { useConfigStore } from '@/stores/config.ts'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

const currentStep = ref(1)
const formRef = ref<FormInstance>()
const setupLoading = ref(false)
const authStore = useAuthStore()
const configStore = useConfigStore()

const initInfo = reactive<InitSystemParams>({
  verificationCode: '',
  blogTitle: '',
  blogSubtitle: '',
  adminNickname: '',
  adminUsername: '',
  adminPassword: '',
})

const rules = reactive<FormRules>({
  verificationCode: [
    {
      required: true,
      message: 'Please enter verification code',
      trigger: 'blur',
    },
  ],
  blogTitle: [
    {
      required: true,
      message: 'Please enter blog title',
      trigger: 'blur',
    },
  ],
  blogSubtitle: [
    {
      required: true,
      message: 'Please enter blog subtitle',
      trigger: 'blur',
    },
  ],
  adminNickname: [
    {
      required: true,
      message: 'Please enter admin nickname',
      trigger: 'blur',
    },
  ],
  adminUsername: [
    {
      required: true,
      message: 'Please enter admin username',
      trigger: 'blur',
    },
  ],
  adminPassword: [
    {
      required: true,
      message: 'Please enter admin password',
      trigger: 'blur',
    },
  ],
})

const getCurrentStepRules = () => {
  if (currentStep.value === 1) {
    return {
      verificationCode: rules.verificationCode,
    }
  } else if (currentStep.value === 2) {
    return {
      blogTitle: rules.blogTitle,
      blogSubtitle: rules.blogSubtitle,
    }
  } else {
    return {
      adminNickname: rules.adminNickname,
      adminUsername: rules.adminUsername,
      adminPassword: rules.adminPassword,
    }
  }
}

const nextStep = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      if (currentStep.value === 1) {
        if (!(await systemApi.verifySystemInitCode(initInfo.verificationCode!))) {
          ElNotification.error('Wrong verification code')
          return
        }
      }

      if (currentStep.value === 3) {
        setupLoading.value = true
        await systemApi.initSystem(initInfo)
        await authStore.login(initInfo.adminUsername, initInfo.adminPassword)
        await configStore.initialConfig()
        ElNotification.success('Blog system setup completed')
        await router.push('/')
        setupLoading.value = false
        return
      }
      currentStep.value++
    }
  })
}

// Go back to the previous step
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

onMounted(() => {
  authStore.logout()
  configStore.resetConfig()
})
</script>
<template>
  <div class="setup-guide-container">
    <!-- Progress Header -->
    <div class="steps-header">
      <div :class="{ active: currentStep === 1, completed: currentStep > 1 }" class="step-item">
        <div class="step-number">1</div>
        <span class="step-title">Verification</span>
      </div>
      <div class="step-line"></div>
      <div :class="{ active: currentStep === 2, completed: currentStep > 2 }" class="step-item">
        <div class="step-number">2</div>
        <span class="step-title">Blog Settings</span>
      </div>
      <div class="step-line"></div>
      <div :class="{ active: currentStep === 3 }" class="step-item">
        <div class="step-number">3</div>
        <span class="step-title">Admin Settings</span>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="setup-content-card">
      <el-form ref="formRef" :model="initInfo" :rules="getCurrentStepRules()" label-position="top">
        <!-- Step 1: Verification Code -->
        <div v-if="currentStep === 1" class="setup-step-content">
          <h1 class="setup-title">Welcome to PlumaSphere Blog System</h1>
          <p class="setup-description">Please input the verification code to continue</p>

          <el-form-item label="Verification Code" prop="verificationCode">
            <el-input v-model="initInfo.verificationCode" placeholder="Enter verification code" />
          </el-form-item>
        </div>

        <!-- Step 2: Blog Information -->
        <div v-if="currentStep === 2" class="setup-step-content">
          <h1 class="setup-title">Blog Information</h1>
          <p class="setup-description">Configure your blog title and subtitle</p>

          <el-form-item label="Blog Title" prop="blogTitle">
            <el-input v-model="initInfo.blogTitle" placeholder="Enter blog title" />
          </el-form-item>

          <el-form-item label="Blog Subtitle" prop="blogSubtitle">
            <el-input v-model="initInfo.blogSubtitle" placeholder="Enter blog subtitle" />
          </el-form-item>
        </div>

        <!-- Step 3: Admin Account Setup -->
        <div v-if="currentStep === 3" class="setup-step-content">
          <h1 class="setup-title">Admin Account Setup</h1>
          <p class="setup-description">Create an admin account with secure password</p>

          <el-form-item label="Nickname" prop="adminNickname">
            <el-input v-model="initInfo.adminNickname" placeholder="Enter nickname" />
          </el-form-item>

          <el-form-item label="Username" prop="adminUsername">
            <el-input v-model="initInfo.adminUsername" placeholder="Enter admin username" />
          </el-form-item>

          <el-form-item label="Password" prop="adminPassword">
            <el-input
              v-model="initInfo.adminPassword"
              placeholder="Enter password"
              show-password
              type="password"
            />
          </el-form-item>
        </div>
      </el-form>

      <!-- Footer with Action Buttons -->
      <div class="setup-actions">
        <div />
        <div class="right-actions">
          <el-button v-if="currentStep > 1" @click="prevStep">Previous</el-button>
          <el-button v-if="currentStep === 1" type="primary" @click="nextStep">Verify</el-button>
          <el-button v-if="currentStep > 1 && currentStep < 3" type="primary" @click="nextStep"
            >Next
          </el-button>
          <el-button
            v-if="currentStep === 3"
            :loading="setupLoading"
            type="primary"
            @click="nextStep"
            >Finish Setup
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup-guide-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.steps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e6e6e6;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.step-title {
  font-size: 14px;
  color: #909399;
}

.step-item.active .step-number {
  background-color: #409eff;
  color: white;
}

.step-item.active .step-title {
  color: #409eff;
  font-weight: bold;
}

.step-item.completed .step-number {
  background-color: #67c23a;
  color: white;
}

.step-line {
  flex-grow: 1;
  height: 1px;
  background-color: #e6e6e6;
  margin: 0 10px 25px;
}

.setup-content-card {
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.setup-title {
  font-size: 24px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
}

.setup-description {
  text-align: center;
  color: #606266;
  margin-bottom: 30px;
}

.setup-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.right-actions {
  display: flex;
  gap: 10px;
}
</style>
