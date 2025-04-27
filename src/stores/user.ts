import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { TokenPair, User } from '@/types'
import { useAuthStore } from '@/stores/auth.ts'
import { userApi } from '@/api/user.ts'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()
  const userInfo = ref<User | null>(null)

  const isLoggedIn = computed(() => !!authStore.getAccessToken)

  const setUserInfo = (newUserInfo: User) => {
    userInfo.value = newUserInfo
  }

  const getUserInfo = computed(async () => {
    if (userInfo.value) return userInfo.value
    return await fetchUserInfo()
  })

  const login = async (username: string, password: string): Promise<TokenPair> => {
    try {
      const response = await userApi.login({ username, password })
      authStore.setTokenPair(response)
      await fetchUserInfo()
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    userInfo.value = null
    authStore.clearTokens()
  }

  const fetchUserInfo = async () => {
    if (!authStore.getAccessToken) return null

    try {
      const info = await userApi.getUserInfo()
      setUserInfo(info)
      return info
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    isLoggedIn,
    getUserInfo,
    login,
    logout,
  }
})
