import { defineStore } from 'pinia'
import type { TokenPair } from '@/types'
import { computed, ref } from 'vue'
import { authApi } from '@/api/auth.ts'
import { DateTime } from 'luxon'
import { useUserStore } from '@/stores/user.ts'

export const useAuthStore = defineStore('auth', () => {
  const tokenPair = ref<TokenPair | null>(null)
  const userStore = useUserStore()

  const isLoggedIn = computed(() => !!tokenPair.value && !isRefreshTokenExpired.value)

  const isAccessTokenExpired = computed(() => {
    if (!tokenPair.value?.accessToken.expiresAt) return false
    const expireTime: DateTime = DateTime.fromISO(tokenPair.value.accessToken.expiresAt)
    return expireTime.diffNow().milliseconds <= 0
  })

  const isRefreshTokenExpired = computed(() => {
    if (!tokenPair.value?.refreshToken.expiresAt) return false
    const expireTime: DateTime = DateTime.fromISO(tokenPair.value.refreshToken.expiresAt)
    return expireTime.diffNow().milliseconds <= 0
  })

  const getRefreshToken = computed(() => {
    if (isRefreshTokenExpired.value || !tokenPair.value) return null
    return tokenPair.value.refreshToken.token
  })

  const getAccessToken = computed(async () => {
    if (!isAccessTokenExpired.value && tokenPair.value) return tokenPair.value.accessToken.token
    if (isRefreshTokenExpired.value) {
      logout()
      return null
    }
    const newTokenPair = await refreshTokens()
    if (!newTokenPair) return null
    return newTokenPair.accessToken.token
  })

  const setTokenPair = (newTokenPair: TokenPair) => {
    tokenPair.value = newTokenPair
    localStorage.setItem('tokenPair', JSON.stringify(newTokenPair))
  }

  const initializeTokens = () => {
    const tokenPairJson = localStorage.getItem('tokenPair')
    if (!tokenPairJson) return

    const parsedTokenPair = JSON.parse(tokenPairJson)
    if (
      parsedTokenPair.refreshToken.expiresAt != null &&
      Date.now() >= parsedTokenPair.refreshToken.expiresAt
    ) {
      clearTokens()
    } else {
      tokenPair.value = parsedTokenPair
    }
  }

  const clearTokens = () => {
    tokenPair.value = null
    localStorage.removeItem('tokenPair')
  }

  const refreshTokens = async (): Promise<TokenPair | null> => {
    if (!getRefreshToken.value) {
      logout()
      console.error('No refresh token or expired')
      return null
    }
    try {
      const response = await authApi.refreshToken(getRefreshToken.value)
      if (!response) {
        console.error('Refresh token failed')
        return null
      }
      setTokenPair(response)
      return response
    } catch (error) {
      logout()
      console.error(error)
      return null
    }
  }

  const login = async (username: string, password: string): Promise<TokenPair> => {
    if (isLoggedIn.value) return Promise.reject(new Error('Already logged in'))
    try {
      const response = await authApi.login({ username, password })
      if (!response) return Promise.reject(new Error('Login failed'))
      setTokenPair(response)
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    userStore.clearUserInfo()
    clearTokens()
  }

  const getNewIdentity = async () => {
    if (isLoggedIn.value) return Promise.reject(new Error('Already logged in'))
    try {
      const response = await authApi.getIdentity()
      if (!response) return Promise.reject(new Error('Get identity failed'))
      setTokenPair(response)
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  initializeTokens()

  return {
    getAccessToken,
    login,
    logout,
    getNewIdentity,
    isLoggedIn,
  }
})
