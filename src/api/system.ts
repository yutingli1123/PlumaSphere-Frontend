import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Config, InitSystemParams } from '@/types'

export const systemApi = {
  async getStatus(): Promise<Config[]> {
    const response = await axiosInstance.get(getPath(ApiEndpoint.SYSTEM_STATUS))
    return JSON.parse(response.data)
  },

  async initSystem(params: InitSystemParams): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.SYSTEM_INIT), params)
  },

  async verifySystemInitCode(code: string): Promise<boolean> {
    const response = await axiosInstance.post(getPath(ApiEndpoint.SYSTEM_INIT_CODE_VERIFY), code)
    return response.data
  },
}
