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
  set: (value) => emit('update:visible', value),
})

const username = ref('')
const password = ref('')
const loading = ref(false)
const authStore = useAuthStore()

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('Please enter username and password')
    return
  }

  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    ElMessage.success('Login successful')
    emit('update:visible', false)
    resetForm()
  } catch {
    ElMessage.error('Login failed, please check your username and password')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  username.value = ''
  password.value = ''
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
      <el-form :model="{ username, password }" label-width="80px">
        <el-form-item label="Username">
          <el-input v-model="username" placeholder="Enter username" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="password" placeholder="Enter password" show-password type="password" />
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
