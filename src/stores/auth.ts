import { defineStore } from 'pinia'
import type { TokenPair } from '@/types'
import { authApi } from '@/api/auth.ts'
import { DateTime } from 'luxon'
import { useUserStore } from '@/stores/user.ts'

/**
 * The auth store.
 */
export const useAuthStore = defineStore('auth', () => {
  // refs
  const tokenPair = ref<TokenPair | null>(null)
  const userStore = useUserStore()

  const loggedIn = ref(false)

  // check if logged in
  const isLoggedIn = () => hasToken() && loggedIn.value

  // check if has token
  const hasToken = () => !!tokenPair.value && !isRefreshTokenExpired()

  // check if access token expired
  const isAccessTokenExpired = () => {
    if (!tokenPair.value?.accessToken.expiresAt) return false
    const expireTime: DateTime = DateTime.fromISO(tokenPair.value.accessToken.expiresAt)
    return expireTime.diffNow().milliseconds <= 0
  }

  // check if refresh token expired
  const isRefreshTokenExpired = () => {
    if (!tokenPair.value?.refreshToken.expiresAt) return false
    const expireTime: DateTime = DateTime.fromISO(tokenPair.value.refreshToken.expiresAt)
    return expireTime.diffNow().milliseconds <= 0
  }

  // get refresh token
  const getRefreshToken = () => {
    if (isRefreshTokenExpired() || !tokenPair.value) return null
    return tokenPair.value.refreshToken.token
  }

  // get access token
  const getAccessToken = async () => {
    if (!isAccessTokenExpired() && tokenPair.value) return tokenPair.value.accessToken.token
    if (isRefreshTokenExpired()) {
      logout()
      return null
    }
    const newTokenPair = await refreshTokens()
    if (!newTokenPair) return null
    return newTokenPair.accessToken.token
  }

  // set logged in
  const setLoggedIn = () => {
    loggedIn.value = true
    localStorage.setItem('loggedIn', 'true')
  }

  // set token pair
  const setTokenPair = (newTokenPair: TokenPair) => {
    tokenPair.value = newTokenPair
    localStorage.setItem('tokenPair', JSON.stringify(newTokenPair))
    userStore.fetchUserInfo().catch(console.error)
  }

  // initialize tokens
  const initializeTokens = () => {
    const tokenPairJson = localStorage.getItem('tokenPair')
    loggedIn.value = localStorage.getItem('loggedIn') === 'true'
    if (!tokenPairJson) return

    const parsedTokenPair = JSON.parse(tokenPairJson) as TokenPair
    if (
      parsedTokenPair.refreshToken?.expiresAt &&
      DateTime.fromISO(parsedTokenPair.refreshToken.expiresAt).diffNow().milliseconds <= 0
    ) {
      clearTokens()
    } else {
      tokenPair.value = parsedTokenPair
    }
  }

  // clear tokens
  const clearTokens = () => {
    tokenPair.value = null
    localStorage.removeItem('tokenPair')
  }

  // refresh tokens
  const refreshTokens = async (): Promise<TokenPair | null> => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      logout()
      console.error('No refresh token or expired')
      return null
    }
    try {
      const response = await authApi.refreshToken(refreshToken)
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

  // login
  const login = async (username: string, password: string): Promise<TokenPair | null> => {
    if (isLoggedIn()) {
      setLoggedIn()
      return tokenPair.value
    }
    try {
      const response = await authApi.login({ username, password })
      if (!response) return Promise.reject(new Error('Login failed'))
      setTokenPair(response)
      setLoggedIn()
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // logout
  const logout = () => {
    userStore.clearUserInfo()
    clearTokens()
    loggedIn.value = false
    localStorage.removeItem('loggedIn')
  }

  // get new identity
  const getNewIdentity = async () => {
    if (hasToken()) {
      return tokenPair.value
    }
    try {
      const response = await authApi.getIdentity()
      if (!response) return Promise.reject(new Error('Get identity failed'))
      setTokenPair(response)
      return response
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // initialize tokens on initialization
  initializeTokens()

  return {
    getAccessToken,
    login,
    logout,
    getNewIdentity,
    isLoggedIn,
    hasToken,
  }
})
