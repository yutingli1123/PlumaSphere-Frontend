<script setup lang="ts">
import { RouterView } from 'vue-router'
import router from '@/router'
import { ConfigFiled, useConfigStore } from '@/stores/config.ts'

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
