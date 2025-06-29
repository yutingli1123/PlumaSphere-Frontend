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

  const user = computed(() => userInfo.value)

  const getUserInfo = async () => {
    if (userInfo.value) return userInfo.value
    return await fetchUserInfo()
  }

  const fetchUserInfo = async () => {
    if (!authStore.hasToken()) return null

    try {
      const info = await userApi.getSelfInfo()
      if (!info) return null
      setUserInfo(info)
      return info
    } catch {
      return null
    }
  }

  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    user,
    clearUserInfo,
    getUserInfo,
    fetchUserInfo,
  }
})
