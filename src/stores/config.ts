import { defineStore } from 'pinia'
import type { Config } from '@/types'
import { systemApi } from '@/api/system.ts'
import { ConfigFiled } from '@/constant'

export const useConfigStore = defineStore('config', () => {
  const config = ref<Config[] | undefined>()

  let initialPromise: Promise<void> | null = null

  const initialConfig = async () => {
    if (initialPromise) {
      return initialPromise
    }
    initialPromise = (async () => {
      const configData = localStorage.getItem('config')
      const version = await systemApi.getStatusVersion()
      if (configData) {
        const parsedConfig = JSON.parse(configData) as Config[]
        const configVersion = parsedConfig.find(
          (item) => item.configKey === ConfigFiled.CONFIG_VERSION.toLowerCase(),
        )
        if (!version || (configVersion && configVersion.configValue === version)) {
          config.value = parsedConfig.filter(
            (item) => item.configKey !== ConfigFiled.CONFIG_VERSION.toLowerCase(),
          )
          return
        }
      }
      const newConfigData = await systemApi.getStatus()
      if (newConfigData) {
        config.value = newConfigData
        newConfigData.push({
          configKey: ConfigFiled.CONFIG_VERSION.toLowerCase(),
          configValue: version,
        } as Config)
        localStorage.setItem('config', JSON.stringify(newConfigData))
      }
    })()
    await initialPromise
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

  const refreshConfig = async () => {
    const newConfigData = await systemApi.getStatus()
    if (newConfigData) {
      config.value = newConfigData
      newConfigData.push({
        configKey: ConfigFiled.CONFIG_VERSION.toLowerCase(),
        configValue: await systemApi.getStatusVersion(),
      } as Config)
      localStorage.setItem('config', JSON.stringify(newConfigData))
    }
  }

  return {
    getConfig,
    loaded,
    initialConfig,
    resetConfig,
    refreshConfig,
  }
})
