import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Config, InitSystemParams } from '@/types'

export const systemApi = {
  async getStatus(): Promise<Config[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.SYSTEM_STATUS))
  },

  async initSystem(params: InitSystemParams): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.SYSTEM_INIT), params)
  },

  async verifySystemInitCode(code: string): Promise<boolean> {
    return await axiosInstance.post(getPath(ApiEndpoint.SYSTEM_INIT_CODE_VERIFY), { value: code })
  },

  async getStatusVersion(): Promise<string | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.SYSTEM_STATUS_VERSION))
  },
}
