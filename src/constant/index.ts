export const tagTypes = ['primary', 'success', 'warning', 'danger'] as const

/**
 * The config file fields.
 */
export enum ConfigFiled {
  INITIALIZED = 'INITIALIZED',
  BLOG_TITLE = 'BLOG_TITLE',
  BLOG_SUBTITLE = 'BLOG_SUBTITLE',
  CONFIG_VERSION = 'CONFIG_VERSION',
  PAGE_SIZE = 'PAGE_SIZE',
}

/**
 * The web socket message types.
 */
export enum WebSocketMessageType {
  NEW_COMMENT = 'NEW_COMMENT',
  LIKE_POST = 'LIKE_POST',
  LIKE_COMMENT = 'LIKE_COMMENT',
}

/**
 * The sort by types.
 */
export enum SortBy {
  TIME = 'Time',
  LIKE = 'Like',
}
