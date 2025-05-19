import { defineStore } from 'pinia'
import type { User } from '@/types'
import { useAuthStore } from '@/stores/auth.ts'
import { userApi } from '@/api/user.ts'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<User | null>(null)
  const authStore = useAuthStore()

  const setUserInfo = (newUserInfo: User) => {
    userInfo.value = newUserInfo
  }

  watch([authStore.isLoggedIn, authStore.hasToken], async () => {
    await fetchUserInfo()
  })

  const getUserInfo = async () => {
    if (userInfo.value) return userInfo.value
    return await fetchUserInfo()
  }

  const fetchUserInfo = async () => {
    if (!authStore.hasToken) return null

    try {
      const info = await userApi.getUserInfo()
      if (!info) return null
      setUserInfo(info)
      return info
    } catch (error) {
      return null
    }
  }

  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    clearUserInfo,
    getUserInfo,
    fetchUserInfo,
  }
})
