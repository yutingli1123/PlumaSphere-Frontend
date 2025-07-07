import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentReplyList from '../CommentReplyList.vue'
import type { Comment, User } from '@/types'
import { commentApi } from '@/api/comment'
import { likeApi } from '@/api/like'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import ElementPlus from 'element-plus'
import { computed } from 'vue'

// Mock Element Plus notification
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElNotification: {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
      closeAll: vi.fn(),
    },
  }
})

// Mock the APIs and stores
vi.mock('@/api/comment', () => ({
  commentApi: {
    getCommentReplies: vi.fn(),
  },
}))

vi.mock('@/api/like', () => ({
  likeApi: {
    getLikesByCommentId: vi.fn(),
    likeComment: vi.fn(),
    unlikeComment: vi.fn(),
  },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(),
}))

vi.mock('@/service/webSocketService.ts', () => ({
  WebSocketServiceInstance: {
    connectCommentWebSocket: vi.fn(),
    disconnectCommentWebSocket: vi.fn(),
  },
}))

describe('CommentReplyList', () => {
  const mockReplies: Comment[] = [
    {
      id: 1,
      content: 'Reply 1',
      authorId: 123,
      authorNickname: 'User1',
      createdAt: '2025-06-29T10:00:00Z',
    },
    {
      id: 2,
      content: 'Reply 2',
      authorId: 456,
      authorNickname: 'User2',
      createdAt: '2025-06-29T11:00:00Z',
    },
  ]

  const defaultProps = {
    commentId: '1',
    replyComment: vi.fn(),
    showBanDialog: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    const mockUserInfo: User = {
      id: 1,
      username: '',
      nickname: '',
      bio: '',
      avatarUrl: '',
      avatarColor: '',
      initials: '',
      dob: '',
      createdAt: '',
      updatedAt: '',
      lastLoginAt: '',
    }
    const mockUserStore = {
      user: computed(() => mockUserInfo),
      getUserInfo: vi.fn(),
      clearUserInfo: vi.fn(),
      fetchUserInfo: vi.fn(),
    } as unknown as ReturnType<typeof useUserStore>
    vi.mocked(useUserStore).mockReturnValue(mockUserStore)

    // mockAuthStore，结构与 useAuthStore 返回值一致
    const mockAuthStore = {
      getAccessToken: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      getNewIdentity: vi.fn(),
      isLoggedIn: vi.fn(() => true),
      hasToken: vi.fn(() => true),
    } as unknown as ReturnType<typeof useAuthStore>
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)

    vi.mocked(commentApi.getCommentReplies).mockResolvedValue(mockReplies)
    vi.mocked(likeApi.getLikesByCommentId).mockResolvedValue(3)
  })

  it('renders component correctly', () => {
    const wrapper = mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('loads comment replies on mount', async () => {
    mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(commentApi.getCommentReplies).toHaveBeenCalledWith('1', 0, 'Time')
  })

  it('handles load more functionality', async () => {
    const wrapper = mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const component = wrapper.vm as {
      loadMore?: () => void
      toggleSortBy?: () => void
      refreshComment?: () => void
      isMore?: boolean
      loading?: boolean
      replyRefreshing?: boolean
      page?: number
      sortBy?: string
      likeComment?: () => void
      fetchLike?: () => void
    }
    expect(component.loadMore).toBeDefined()

    // Test initial state
    expect(component.page).toBe(0)
    expect(component.isMore).toBe(true)
  })

  it('handles sort toggle functionality', async () => {
    const wrapper = mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const component = wrapper.vm as {
      loadMore?: () => void
      toggleSortBy?: () => void
      refreshComment?: () => void
      isMore?: boolean
      loading?: boolean
      replyRefreshing?: boolean
      page?: number
      sortBy?: string
      likeComment?: () => void
      fetchLike?: () => void
    }
    expect(component.toggleSortBy).toBeDefined()

    const initialSort = component.sortBy
    await component.toggleSortBy?.()

    expect(component.sortBy).not.toBe(initialSort)
  })

  it('handles like functionality', async () => {
    vi.mocked(likeApi.likeComment).mockResolvedValue(undefined)

    const wrapper = mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const component = wrapper.vm as {
      loadMore?: () => void
      toggleSortBy?: () => void
      refreshComment?: () => void
      isMore?: boolean
      loading?: boolean
      replyRefreshing?: boolean
      page?: number
      sortBy?: string
      likeComment?: () => void
      fetchLike?: () => void
    }

    // Test like functions exist
    expect(component.likeComment).toBeDefined()
    expect(component.fetchLike).toBeDefined()
  })

  it('handles refresh functionality', async () => {
    const wrapper = mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const component = wrapper.vm as {
      loadMore?: () => void
      toggleSortBy?: () => void
      refreshComment?: () => void
      isMore?: boolean
      loading?: boolean
      replyRefreshing?: boolean
      page?: number
      sortBy?: string
      likeComment?: () => void
      fetchLike?: () => void
    }
    expect(component.refreshComment).toBeDefined()

    await component.refreshComment?.()

    // Should reset page and reload comments
    expect(commentApi.getCommentReplies).toHaveBeenCalled()
  })

  it('handles empty replies correctly', async () => {
    vi.mocked(commentApi.getCommentReplies).mockResolvedValue([])

    const wrapper = mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 100)) // Allow async operations to complete

    const component = wrapper.vm as {
      loadMore?: () => void
      toggleSortBy?: () => void
      refreshComment?: () => void
      isMore?: boolean
      loading?: boolean
      replyRefreshing?: boolean
      page?: number
      sortBy?: string
      likeComment?: () => void
      fetchLike?: () => void
    }
    expect(component.isMore).toBe(false)
  })

  it('handles loading states correctly', () => {
    const wrapper = mount(CommentReplyList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const component = wrapper.vm as {
      loadMore?: () => void
      toggleSortBy?: () => void
      refreshComment?: () => void
      isMore?: boolean
      loading?: boolean
      replyRefreshing?: boolean
      page?: number
      sortBy?: string
      likeComment?: () => void
      fetchLike?: () => void
    }
    expect(component.loading).toBe(false)
    expect(component.replyRefreshing).toBe(false)
  })
})
