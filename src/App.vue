<script setup lang="ts">
import { RouterView } from 'vue-router'
import router from '@/router'
import { useConfigStore } from '@/stores/config.ts'
import { ConfigFiled } from '@/constant'

onMounted(async () => {
  const configStore = useConfigStore()
  await configStore.initialConfig()
  if (configStore.loaded && !configStore.getConfig(ConfigFiled.INITIALIZED)) {
    await router.push('/setup')
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
