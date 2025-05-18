export interface Article {
  id: number
  title: string
  content?: string
  description?: string
  authorId: number
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export interface ArticleRequest {
  title: string
  content: string
  tags: number[]
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
  dob: string
  createdAt: string
  updatedAt: string
  lastLoginAt: string
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

export enum ConfigFiled {
  INITIALIZED = 'INITIALIZED',
  BLOG_TITLE = 'BLOG_TITLE',
  BLOG_SUBTITLE = 'BLOG_SUBTITLE',
}
