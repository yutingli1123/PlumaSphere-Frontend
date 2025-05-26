export const tagTypes = ['primary', 'success', 'warning', 'danger'] as const

export enum ConfigFiled {
  INITIALIZED = 'INITIALIZED',
  BLOG_TITLE = 'BLOG_TITLE',
  BLOG_SUBTITLE = 'BLOG_SUBTITLE',
  CONFIG_VERSION = 'CONFIG_VERSION',
  PAGE_SIZE = 'PAGE_SIZE',
}

export enum WebSocketMessageType {
  NEW_COMMENT = 'NEW_COMMENT',
  LIKE_POST = 'LIKE_POST',
  LIKE_COMMENT = 'LIKE_COMMENT',
}

export enum SortBy {
  TIME = 'Time',
  LIKE = 'Like',
}
