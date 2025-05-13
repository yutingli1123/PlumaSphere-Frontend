<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => {
    resetForm()
    emit('update:visible', value)
  },
})

const loginParams = ref({
  username: '',
  password: '',
})

const loading = ref(false)
const authStore = useAuthStore()

const formRef = ref()
const rules = {
  username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
}

const handleLogin = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      await authStore.login(loginParams.value.username, loginParams.value.password)
      ElNotification.success('Login successful')
      emit('update:visible', false)
      resetForm()
    } catch {
      ElNotification.error('Login failed, please check your username and password')
    } finally {
      loading.value = false
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  loginParams.value.username = ''
  loginParams.value.password = ''
}

const closeDialog = () => {
  emit('update:visible', false)
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    center
    destroy-on-close
    title="Login"
    width="400px"
  >
    <div class="dialog-content">
      <el-form ref="formRef" :model="loginParams" :rules="rules" label-width="80px">
        <el-form-item label="Username" prop="username">
          <el-input v-model="loginParams.username" placeholder="Enter username" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginParams.password"
            placeholder="Enter password"
            show-password
            type="password"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button :loading="loading" type="primary" @click="handleLogin">Login</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.dialog-content {
  padding: 0 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>
