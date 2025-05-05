<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { systemApi } from '@/api/system.ts'
import router from '@/router'
import { type Config, ConfigFiled } from '@/types'

onMounted(async () => {
  const systemStatus: Config[] | undefined = await systemApi.getStatus()
  if (
    systemStatus === undefined ||
    !systemStatus.some((value) => value.configKey === ConfigFiled.INITIALIZED.toLowerCase())
  ) {
    await router.push('/setup')
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
