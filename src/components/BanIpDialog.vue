<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import { adminApi } from '@/api/admin.ts'
import { DateTime } from 'luxon'
import type { BanIpRequest } from '@/types'

// props
const { closeDialog } = defineProps<{
  closeDialog: () => void
}>()

// refs
const expiration = ref<Date | undefined>()
const formRef = ref<FormInstance>()
const loading = ref(false)

// form data
const formData = reactive({ address: '', reason: '' })

// rules for the form
const rules: FormRules = {
  address: [{ required: true, message: 'Please enter the IP address', trigger: 'blur' }],
  reason: [{ required: true, message: 'Please enter the reason', trigger: 'blur' }],
}

// ban ip function
const banIp = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      let expirationDate
      if (expiration.value !== undefined)
        expirationDate = DateTime.fromJSDate(expiration.value).toISO()
      const banIpRequest: BanIpRequest = {
        ipAddress: formData.address,
        reason: formData.reason,
        expiresAt: expirationDate ?? undefined,
      }

      const result = await adminApi.banIp(banIpRequest)
      loading.value = false

      if (result) {
        ElNotification.info(result)
        closeDialog()
      }
    }
  })
}
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" class="form">
    <el-form-item label="IP Address" label-width="100px" prop="address">
      <el-input v-model="formData.address" placeholder="Input the IP address for banning" />
    </el-form-item>
    <el-form-item label="Reason" label-width="100px" prop="reason">
      <el-input v-model="formData.reason" placeholder="Input the reason for banning" />
    </el-form-item>
    <el-form-item label="Expiration" label-width="100px">
      <el-date-picker v-model="expiration" clearable type="datetime" />
    </el-form-item>
    <el-form-item class="button-container">
      <div class="buttons-wrapper">
        <el-popconfirm title="Are you sure to ban this IP?" @confirm="banIp">
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

/*noinspection CssUnusedSymbol*/
.button-container :deep(.el-form-item__content) {
  justify-content: flex-end;
  display: flex;
}

.buttons-wrapper {
  display: flex;
  gap: 10px;
}
</style>
