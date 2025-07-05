import { defineStore } from 'pinia'
import type { User } from '@/types'
import { useAuthStore } from '@/stores/auth.ts'
import { userApi } from '@/api/user.ts'

/**
 * The user store.
 */
export const useUserStore = defineStore('user', () => {
  // refs
  const userInfo = ref<User | null>(null)
  const authStore = useAuthStore()

  // set user info
  const setUserInfo = (newUserInfo: User) => {
    userInfo.value = newUserInfo
  }

  // check if user info is set
  const user = computed(() => userInfo.value)

  // get user info
  const getUserInfo = async () => {
    if (userInfo.value) return userInfo.value
    return await fetchUserInfo()
  }

  // fetch user info
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

  // clear user info
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
