import type { WebSocketMessageType } from '@/constant'

/**
 * The article type.
 */
export interface Article {
  id: number
  title: string
  content?: string
  description?: string
  authorId: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

/**
 * The article request type.
 */
export interface ArticleRequest {
  title: string
  content: string
  tags: string[]
}

/**
 * The article update request type.
 */
export interface ArticleUpdateRequest extends ArticleRequest {
  id: string
}

/**
 * The tag type.
 */
export interface Tag {
  id: number
  name: string
  postCount?: number
}

/**
 * The token details type.
 */
export interface TokenDetails {
  token: string
  expiresAt: string | null
}

/**
 * The token pair type.
 */
export interface TokenPair {
  accessToken: TokenDetails
  refreshToken: TokenDetails
}

/**
 * The user type.
 */
export interface User {
  id: number
  username: string
  nickname: string
  bio: string
  avatarUrl: string
  avatarColor: string
  initials: string
  dob: string
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

/**
 * The user with admin info type.
 */
export interface UserWithAdminInfo extends User {
  isBanned: boolean
  banReason: string
  bannedAt: string
  banExpiresAt: string | null
  isPendingIpBan: boolean
  ipBanReason: string
  ipBanExpiresAt: string | null
  isAdmin: boolean
}

/**
 * The banned IP type.
 */
export interface BannedIp {
  id: number
  ipAddress: string
  reason: string
  bannedAt: string
  expiresAt: string | null
}

/**
 * The user update type.
 */
export interface UserUpdate {
  nickname: string
  bio: string
  dob: string
}

/**
 * The login params type.
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * The config type.
 */
export interface Config {
  configKey: string
  configValue: string
}

/**
 * The comment type.
 */
export interface Comment {
  id: number
  content: string
  authorId: number
  authorNickname: string
  createdAt: string
}

/**
 * The comment request type.
 */
export interface CommentRequest {
  content: string
}

/**
 * The init system params type.
 */
export interface InitSystemParams {
  verificationCode: string
  blogTitle: string
  blogSubtitle: string
  adminUsername: string
  adminPassword: string
  adminNickname: string
}

/**
 * The web socket message type.
 */
export interface WebSocketMessage {
  type: WebSocketMessageType
  data: object
}

/**
 * The ban request type.
 */
export interface BanRequest {
  userId: number
  reason: string
  expiresAt?: string
}

/**
 * The ban IP request type.
 */
export interface BanIpRequest {
  ipAddress: string
  reason: string
  expiresAt?: string
}

/**
 * The banned IP type.
 */
export interface BannedIp {
  id: number
  ipAddress: string
  reason: string
  bannedAt: string
  expiresAt: string | null
}
