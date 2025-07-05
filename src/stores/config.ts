import { defineStore } from 'pinia'
import type { Config } from '@/types'
import { systemApi } from '@/api/system.ts'
import { ConfigFiled } from '@/constant'

/**
 * The config store.
 */
export const useConfigStore = defineStore('config', () => {
  // refs
  const config = ref<Config[] | undefined>()
  let initialPromise: Promise<void> | null = null

  // initial config
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
        const configWithVersion = [
          ...newConfigData,
          {
            configKey: ConfigFiled.CONFIG_VERSION.toLowerCase(),
            configValue: version,
          } as Config,
        ]
        localStorage.setItem('config', JSON.stringify(configWithVersion))
      }
    })()
    await initialPromise
  }

  // reset config
  const resetConfig = () => {
    config.value = undefined
    localStorage.removeItem('config')
  }

  // check if loaded
  const loaded = computed(() => !!config.value)

  // get config
  const getConfig = (key: ConfigFiled) => {
    if (!config.value) return null
    const configItem = config.value.find((item) => item.configKey === key.toLowerCase())
    return configItem?.configValue ?? null
  }

  // refresh config
  const refreshConfig = async () => {
    const newConfigData = await systemApi.getStatus()
    if (newConfigData) {
      config.value = newConfigData
      const configWithVersion = [
        ...newConfigData,
        {
          configKey: ConfigFiled.CONFIG_VERSION.toLowerCase(),
          configValue: await systemApi.getStatusVersion(),
        } as Config,
      ]
      localStorage.setItem('config', JSON.stringify(configWithVersion))
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
