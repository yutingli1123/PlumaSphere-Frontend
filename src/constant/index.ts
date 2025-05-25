export const tagTypes = ['primary', 'success', 'warning', 'danger'] as const

export enum WebSocketMessageType {
  NEW_COMMENT = 'NEW_COMMENT',
  LIKE_POST = 'LIKE_POST',
  LIKE_COMMENT = 'LIKE_COMMENT',
}

export enum SortBy {
  TIME = 'Time',
  LIKE = 'Like',
}
