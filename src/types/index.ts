import type { WebSocketMessageType } from '@/constant'

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

export interface ArticleRequest {
  title: string
  content: string
  tags: string[]
}

export interface ArticleUpdateRequest extends ArticleRequest {
  id: string
}

export interface Tag {
  id: number
  name: string
  postCount?: number
}

export interface TokenDetails {
  token: string
  expiresAt: string | null
}

export interface TokenPair {
  accessToken: TokenDetails
  refreshToken: TokenDetails
}

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

export interface UserUpdate {
  nickname: string
  bio: string
  dob: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface Config {
  configKey: string
  configValue: string
}

export interface Comment {
  id: number
  content: string
  authorId: number
  authorNickname: string
  createdAt: string
}

export interface CommentRequest {
  content: string
}

export interface InitSystemParams {
  verificationCode: string
  blogTitle: string
  blogSubtitle: string
  adminUsername: string
  adminPassword: string
  adminNickname: string
}

export interface WebSocketMessage {
  type: WebSocketMessageType
  data: object
}
