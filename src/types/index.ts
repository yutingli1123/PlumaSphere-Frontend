export interface Article {
  id: number
  title: string
  content?: string
  description?: string
  authorId: number
  tags: Tag[]
  likedBy?: number[]
  createdAt: number
  updatedAt: number
}

export interface Tag {
  id: number
  name: string
}

export interface TokenDetails {
  token: string
  expiresAt: number
}

export interface TokenPair {
  accessToken: TokenDetails
  refreshToken: TokenDetails
}

export interface User {
  id: number
  username: string
  nickname: string
  avatarUrl?: string
}

export interface LoginParams {
  username: string
  password: string
}
