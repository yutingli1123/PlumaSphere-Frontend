<script setup lang="ts">
import { RouterView } from 'vue-router'
import router from '@/router'
import { useConfigStore } from '@/stores/config.ts'
import { ConfigFiled } from '@/constant'

const configStore = useConfigStore()

// Watch for config changes and update page title
watch(
  () => configStore.loaded,
  (loaded) => {
    if (loaded) {
      const title = configStore.getConfig(ConfigFiled.BLOG_TITLE)
      if (title) {
        document.title = title
      }
    }
  },
  { immediate: true },
)

onMounted(async () => {
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
