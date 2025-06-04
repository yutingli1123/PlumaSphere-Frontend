<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { adminApi } from '@/api/admin.ts'
import { DateTime } from 'luxon'
import type { BanRequest } from '@/types'

const { userId, closeDialog } = defineProps<{
  userId: number | undefined
  closeDialog: () => void
}>()

const expiration = ref<Date | undefined>()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = ref({ reason: '' })

const rules: FormRules = {
  reason: [{ required: true, message: 'Please enter the reason', trigger: 'blur' }],
}

const banUser = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      if (!userId) return
      let expirationDate
      if (expiration.value !== undefined)
        expirationDate = DateTime.fromJSDate(expiration.value).toISO()
      const banRequest: BanRequest = {
        userId,
        reason: formData.value.reason,
        expiresAt: expirationDate ?? undefined,
      }
      const result = await adminApi.banUser(banRequest)
      loading.value = false
      if (result) {
        ElMessage.info(result)
        closeDialog()
      }
    }
  })
}

const banIp = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true

      if (!userId) return
      let expirationDate
      if (expiration.value !== undefined)
        expirationDate = DateTime.fromJSDate(expiration.value).toISO()
      const banRequest: BanRequest = {
        userId,
        reason: formData.value.reason,
        expiresAt: expirationDate ?? undefined,
      }

      const result = await adminApi.banIPByUserId(banRequest)
      loading.value = false

      if (result) {
        ElMessage.info(result)
        closeDialog()
      }
    }
  })
}
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" class="form">
    <el-form-item label="User ID" label-width="80px">
      <el-input :model-value="userId" disabled />
    </el-form-item>
    <el-form-item label="Reason" label-width="80px" prop="reason">
      <el-input v-model="formData.reason" placeholder="Input the reason for banning" />
    </el-form-item>
    <el-form-item label="Expiration" label-width="80px">
      <el-date-picker v-model="expiration" clearable type="datetime" />
    </el-form-item>
    <el-form-item class="button-container">
      <div class="buttons-wrapper">
        <el-popconfirm title="Are you sure to ban this user?" @confirm="banUser">
          <template #reference>
            <el-button :loading="loading" type="danger">Ban</el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm title="Are you sure to ban IP of this user?" @confirm="banIp">
          <template #reference>
            <el-button :loading="loading" type="danger">Ban IP</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.form {
  margin: 20px 20px -10px 20px;
}

.button-container :deep(.el-form-item__content) {
  justify-content: flex-end;
  display: flex;
}

.buttons-wrapper {
  display: flex;
  gap: 10px;
}
</style>
