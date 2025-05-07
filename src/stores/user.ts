import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { useAuthStore } from '@/stores/auth.ts'
import { userApi } from '@/api/user.ts'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<User | null>(null)
  const authStore = useAuthStore()

  const isLoggedIn = computed(() => !!authStore.getAccessToken)

  const setUserInfo = (newUserInfo: User) => {
    userInfo.value = newUserInfo
  }

  const getUserInfo = computed(async () => {
    if (userInfo.value) return userInfo.value
    return await fetchUserInfo()
  })

  const fetchUserInfo = async () => {
    if (!authStore.getAccessToken) return null

    try {
      const info = await userApi.getUserInfo()
      if (!info) return Promise.reject(new Error('Get user info failed'))
      setUserInfo(info)
      return info
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    fetchUserInfo,
    clearUserInfo,
    isLoggedIn,
    getUserInfo,
  }
})
