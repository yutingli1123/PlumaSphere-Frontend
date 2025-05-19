import { defineStore } from 'pinia'
import type { Config } from '@/types'
import { systemApi } from '@/api/system.ts'

export enum ConfigFiled {
  INITIALIZED = 'INITIALIZED',
  BLOG_TITLE = 'BLOG_TITLE',
  BLOG_SUBTITLE = 'BLOG_SUBTITLE',
}

export const useConfigStore = defineStore('config', () => {
  const config = ref<Config[] | undefined>()

  const initialConfig = async () => {
    const configData = await systemApi.getStatus()
    if (configData) {
      config.value = configData
    }
  }

  const loaded = computed(() => !!config.value)

  const getConfig = (key: ConfigFiled) => {
    if (!config.value) return null
    const configItem = config.value.find((item) => item.configKey === key.toLowerCase())
    return configItem?.configValue ?? null
  }

  return {
    getConfig,
    loaded,
    initialConfig,
  }
})
