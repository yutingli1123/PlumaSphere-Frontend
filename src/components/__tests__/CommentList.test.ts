import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CommentList from '@/components/CommentList.vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { likeApi } from '@/api/like'
import { commentApi } from '@/api/comment'
import type { Comment } from '@/types'
import { ElMessage } from 'element-plus'
import ElementPlus from 'element-plus'

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElNotification: {
      closeAll: vi.fn(),
      error: vi.fn(),
      success: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
  }
})

// Mock the APIs and stores
vi.mock('@/api/like', () => ({
  likeApi: {
    getLikesByCommentId: vi.fn(),
    likeComment: vi.fn(),
    unlikeComment: vi.fn(),
  },
}))

vi.mock('@/api/comment', () => ({
  commentApi: {
    replyComment: vi.fn(),
    getCommentReplies: vi.fn(),
  },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(),
}))

// Mock types for tests
interface MockAuthStore {
  isLoggedIn: () => boolean
  hasToken: () => boolean
  getNewIdentity: () => Promise<unknown>
  user: { id: number }
}

interface MockUserStore {
  getUserInfo: () => Promise<{ id: number }>
  user: { id: number }
}

// Component instance type with internal methods
interface CommentListInstance {
  fetchLike: (id: string) => Promise<void>
  likeComment: (commentId: number | string) => Promise<void>
  getLike: (commentId: number | string) => Promise<number>
  switchReplyComment: (commentId: number) => Promise<void>
  replyPost: (commentId: number) => Promise<void>
  commentReplying: Record<number, boolean>
}

describe('CommentList', () => {
  const mockComments: Comment[] = [
    {
      id: 1,
      content: 'Test comment 1',
      authorId: 123,
      authorNickname: 'User1',
      createdAt: '2025-06-29T10:00:00Z',
    },
    {
      id: 2,
      content: 'Test comment 2',
      authorId: 456,
      authorNickname: 'User2',
      createdAt: '2025-06-29T11:00:00Z',
    },
  ]

  const defaultProps = {
    comments: mockComments,
    deleteComment: vi.fn(),
    showBanDialog: vi.fn(),
  }

  let mockAuthStore: MockAuthStore
  let mockUserStore: MockUserStore

  beforeEach(() => {
    vi.clearAllMocks()

    mockAuthStore = {
      isLoggedIn: vi.fn().mockReturnValue(true),
      hasToken: vi.fn().mockReturnValue(true),
      getNewIdentity: vi.fn().mockResolvedValue(undefined),
      user: { id: 123 },
    }

    mockUserStore = {
      getUserInfo: vi.fn().mockResolvedValue({ id: 123 }),
      user: { id: 123 },
    }

    vi.mocked(useAuthStore).mockReturnValue(
      mockAuthStore as unknown as ReturnType<typeof useAuthStore>,
    )
    vi.mocked(useUserStore).mockReturnValue(
      mockUserStore as unknown as ReturnType<typeof useUserStore>,
    )
    vi.mocked(likeApi.getLikesByCommentId).mockResolvedValue(5)
  })

  it('renders comments correctly', async () => {
    const wrapper = mount(CommentList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          CommentReplyList: true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Test comment 1')
    expect(wrapper.text()).toContain('Test comment 2')
    expect(wrapper.text()).toContain('User1')
    expect(wrapper.text()).toContain('User2')
  })

  it('renders when no comments provided', () => {
    const wrapper = mount(CommentList, {
      props: {
        ...defaultProps,
        comments: undefined,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          CommentReplyList: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('renders when empty comments array provided', () => {
    const wrapper = mount(CommentList, {
      props: {
        ...defaultProps,
        comments: [],
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          CommentReplyList: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('fetches likes on mount', async () => {
    mount(CommentList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          CommentReplyList: true,
        },
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(likeApi.getLikesByCommentId).toHaveBeenCalledWith(1)
    expect(likeApi.getLikesByCommentId).toHaveBeenCalledWith(2)
  })

  it('handles like functionality', async () => {
    vi.mocked(likeApi.likeComment).mockResolvedValue(undefined)

    const wrapper = mount(CommentList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          CommentReplyList: true,
        },
      },
    })

    const component = wrapper.vm as unknown as CommentListInstance

    // Test like function exists
    expect(component.likeComment).toBeDefined()
    expect(component.getLike).toBeDefined()
  })

  it('handles reply functionality', async () => {
    vi.mocked(commentApi.replyComment).mockResolvedValue(true)

    const wrapper = mount(CommentList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          CommentReplyList: true,
        },
      },
    })

    const component = wrapper.vm as unknown as CommentListInstance

    // Test reply functions exist
    expect(component.switchReplyComment).toBeDefined()
    expect(component.replyPost).toBeDefined()
  })

  it('shows reply input when toggled', async () => {
    const wrapper = mount(CommentList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          CommentReplyList: true,
        },
      },
    })

    const component = wrapper.vm as unknown as CommentListInstance

    // Toggle reply for first comment
    await component.switchReplyComment(1)
    await wrapper.vm.$nextTick()

    expect(component.commentReplying[1]).toBe(true)
  })
})
