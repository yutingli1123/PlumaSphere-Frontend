import { defineStore } from 'pinia'
import type { TokenPair } from '@/types'
import { computed, ref } from 'vue'
import { authApi } from '@/api/auth.ts'

export const useAuthStore = defineStore('auth', () => {
  const tokenPair = ref<TokenPair | null>(null)

  const isAccessTokenExpired = computed(() => {
    if (!tokenPair.value?.accessToken.expiresAt) return true
    return Date.now() >= tokenPair.value.accessToken.expiresAt
  })

  const isRefreshTokenExpired = computed(() => {
    if (!tokenPair.value?.refreshToken.expiresAt) return true
    return Date.now() >= tokenPair.value.refreshToken.expiresAt
  })

  const getRefreshToken = computed(() => {
    if (isRefreshTokenExpired.value || !tokenPair.value) return null
    return tokenPair.value.refreshToken.token
  })

  const getAccessToken = computed(async () => {
    if (!isAccessTokenExpired.value && tokenPair.value) return tokenPair.value.accessToken.token
    if (isRefreshTokenExpired.value) {
      clearTokens()
      return null
    }
    return (await refreshTokens()).accessToken.token
  })

  const setTokenPair = (newTokenPair: TokenPair) => {
    tokenPair.value = newTokenPair
    localStorage.setItem('tokenPair', JSON.stringify(newTokenPair))
  }

  const initializeTokens = () => {
    const tokenPairJson = localStorage.getItem('tokenPair')
    if (!tokenPairJson) return

    const parsedTokenPair = JSON.parse(tokenPairJson)
    if (Date.now() >= parsedTokenPair.refreshToken.expiresAt) {
      clearTokens()
    } else {
      tokenPair.value = parsedTokenPair
    }
  }

  const clearTokens = () => {
    tokenPair.value = null
    localStorage.removeItem('tokenPair')
  }

  const refreshTokens = async (): Promise<TokenPair> => {
    if (!getRefreshToken.value) {
      clearTokens()
      return Promise.reject(new Error('No refresh token or expired'))
    }
    try {
      const response = await authApi.refreshToken(getRefreshToken.value)
      setTokenPair(response)
      return response
    } catch (error) {
      clearTokens()
      return Promise.reject(error)
    }
  }

  initializeTokens()

  return {
    getAccessToken,
    setTokenPair,
    clearTokens,
  }
})
