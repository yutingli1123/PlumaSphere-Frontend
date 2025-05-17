<script setup lang="ts">
import { RouterView } from 'vue-router'
import { systemApi } from '@/api/system.ts'
import router from '@/router'
import { type Config, ConfigFiled } from '@/types'

onMounted(async () => {
  const systemStatus: Config[] | undefined | null = await systemApi.getStatus()
  if (
    !!systemStatus &&
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
