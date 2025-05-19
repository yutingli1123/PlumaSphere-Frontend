import { defineStore } from 'pinia'
import type { Config } from '@/types'
import { systemApi } from '@/api/system.ts'

export enum ConfigFiled {
  INITIALIZED = 'INITIALIZED',
  BLOG_TITLE = 'BLOG_TITLE',
  BLOG_SUBTITLE = 'BLOG_SUBTITLE',
  VERSION = 'VERSION',
}

export const useConfigStore = defineStore('config', () => {
  const config = ref<Config[] | undefined>()

  const initialConfig = async () => {
    const configData = localStorage.getItem('config')
    const version = await systemApi.getStatusVersion()
    if (configData) {
      const parsedConfig = JSON.parse(configData) as Config[]
      const configVersion = parsedConfig.find(
        (item) => item.configKey === ConfigFiled.VERSION.toLowerCase(),
      )
      if (!version || (configVersion && configVersion.configValue === version)) {
        config.value = parsedConfig
        return
      }
    }
    const newConfigData = await systemApi.getStatus()
    if (newConfigData) {
      config.value = newConfigData
      newConfigData.push({
        configKey: ConfigFiled.VERSION.toLowerCase(),
        configValue: versio,
      } as Config)
      localStorage.setItem('config', JSON.stringify(newConfigData))
    }
  }

  const resetConfig = () => {
    config.value = undefined
    localStorage.removeItem('config')
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
    resetConfig,
  }
})
