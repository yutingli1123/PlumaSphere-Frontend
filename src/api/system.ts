import axiosInstance from '@/utils/axios.ts'
import { ApiEndpoint, getPath } from '@/api/endpoints.ts'
import type { Config, InitSystemParams } from '@/types'

/**
 * The system API.
 */
export const systemApi = {
  /**
   * Get the system status.
   * @returns The system status.
   */
  async getStatus(): Promise<Config[] | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.SYSTEM_STATUS))
  },

  /**
   * Initialize the system.
   * @param params - The parameters to initialize the system.
   */
  async initSystem(params: InitSystemParams): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.SYSTEM_INIT), params)
  },

  /**
   * Verify the system initialization code.
   * @param code - The code to verify.
   * @returns The response from the API.
   */
  async verifySystemInitCode(code: string): Promise<boolean> {
    return await axiosInstance.post(getPath(ApiEndpoint.SYSTEM_INIT_CODE_VERIFY), { value: code })
  },

  /**
   * Get the system status version.
   * @returns The system status version.
   */
  async getStatusVersion(): Promise<string | undefined> {
    return await axiosInstance.get(getPath(ApiEndpoint.SYSTEM_STATUS_VERSION))
  },

  /**
   * Update the system settings.
   * @param settings - The settings to update.
   */
  async updateSettings(settings: Config[]): Promise<void> {
    await axiosInstance.post(getPath(ApiEndpoint.SYSTEM_UPDATE_SETTINGS), settings, {
      requiresAuth: true,
    })
  },
}
