export enum ApiEndpoint {
  BASE_API = '/api/v1',
  BASE_WEB_SOCKET = '/ws',

  LOGIN = '/login',
  TOKEN_REFRESH = '/refresh-token',
  IDENTITY = '/get-identity',
  TOKEN_VALIDATION = '/check-token-validation',

  SYSTEM_STATUS = '/status',
  SYSTEM_INIT = '/init',
  SYSTEM_INIT_CODE_VERIFY = `${SYSTEM_INIT}/verify-code`,

  POST_BASE = '/post',
  POST_GET_ALL = `${POST_BASE}`,
  POST_PAGE_COUNT = `${POST_BASE}/count-page`,
  POST_COUNT = `${POST_BASE}/count`,
  POST_GET_BY_ID = `${POST_BASE}/:id`,
  POST_CREATE = `${POST_BASE}`,
  POST_UPDATE = `${POST_BASE}/:id`,
  POST_DELETE = `${POST_BASE}/:id`,

  USER_BASE = '/user',
  USER_GET_ALL = `${USER_BASE}`,
  USER_GET_ME = `${USER_BASE}/me`,
  USER_GET_BY_ID = `${USER_BASE}/:userId`,

  COMMENT_BASE = '/comment',
  COMMENT_GET_BY_ID = `${COMMENT_BASE}/:id`,
  COMMENT_GET_ALL_BY_POST_ID = `${POST_BASE}/:postId/comment`,
  COMMENT_CREATE_BY_POST_ID = `${POST_BASE}/:postId/comment`,
  COMMENT_PAGE_COUNT_BY_POST_ID = `${COMMENT_GET_ALL_BY_POST_ID}/count-page`,
  COMMENT_COUNT_BY_POST_ID = `${POST_BASE}/:postId/comment/count`,

  LIKE_COUNT_BY_POST_ID = `${POST_BASE}/:postId/like`,
  LIKE_COUNT_BY_COMMENT_ID = `${COMMENT_BASE}/:commentId/like`,
  LIKE_POST = `${POST_BASE}/:postId/like`,
  LIKE_COMMENT = `${COMMENT_BASE}/:commentId/like`,
  LIKE_POST_STATE = `${LIKE_POST}/state`,
  LIKE_COMMENT_STATE = `${LIKE_COMMENT}/state`,

  TAG_BASE = '/tag',
  TAG_GET_ALL = `${TAG_BASE}`,
  TAG_ADD = `${TAG_BASE}`,
}

export const getPath = (path: ApiEndpoint, params?: Record<string, string | number>): string => {
  let pathString: string = path.toString()

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      pathString = pathString.replace(`:${key}`, String(value))
    })
  }

  return pathString
}
