import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Mock router and external dependencies first to break circular imports
vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
    replace: vi.fn(),
    currentRoute: { value: { params: {} } },
  },
}))

// Mock DateTime from luxon
vi.mock('luxon', () => ({
  DateTime: {
    fromISO: vi.fn(() => ({
      toLocaleString: vi.fn(() => '2024-01-01 12:00'),
      toRelative: vi.fn(() => '1 hour ago'),
    })),
  },
}))

// Mock Vditor
vi.mock('vditor', () => ({
  default: vi.fn().mockImplementation(() => ({
    getValue: vi.fn(() => 'test content'),
    setValue: vi.fn(),
    destroy: vi.fn(),
  })),
}))

// Mock all API modules
vi.mock('@/api/post', () => ({
  postApi: {
    getPostById: vi.fn(),
    deletePost: vi.fn(),
    updatePost: vi.fn(),
  },
}))

vi.mock('@/api/user', () => ({
  userApi: {
    getUserById: vi.fn(),
  },
}))

vi.mock('@/api/comment', () => ({
  commentApi: {
    getCommentsByPostId: vi.fn(),
    createComment: vi.fn(),
  },
}))

vi.mock('@/api/like', () => ({
  likeApi: {
    likePost: vi.fn(),
    unlikePost: vi.fn(),
  },
}))

// Mock stores
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    isLoggedIn: false,
    user: null,
    token: null,
  })),
}))

// Mock WebSocket service
vi.mock('@/service/webSocketService', () => ({
  WebSocketServiceInstance: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    sendMessage: vi.fn(),
    onMessage: vi.fn(),
  },
}))

// Import the component after all mocks are set
import PostView from '../PostView.vue'

describe('PostView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders correctly with minimal mocking', () => {
    const wrapper = shallowMount(PostView, {
      props: { postId: '1' },
      global: {
        stubs: {
          TopNavigation: true,
          PageFooter: true,
          CommentForm: true,
          CommentList: true,
          ToggleSortTypeButton: true,
          BanDialog: true,
          IEpEdit: true,
          IEpDelete: true,
          IMdiThumbUp: true,
          IMdiThumbUpOutline: true,
          RouterLink: true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('accepts postId prop correctly', () => {
    const wrapper = shallowMount(PostView, {
      props: { postId: '123' },
      global: {
        stubs: {
          TopNavigation: true,
          PageFooter: true,
          CommentForm: true,
          CommentList: true,
          ToggleSortTypeButton: true,
          BanDialog: true,
          IEpEdit: true,
          IEpDelete: true,
          IMdiThumbUp: true,
          IMdiThumbUpOutline: true,
          RouterLink: true,
        },
      },
    })
    expect(wrapper.props('postId')).toBe('123')
  })

  it('handles string postId prop', () => {
    const wrapper = shallowMount(PostView, {
      props: { postId: 'test-post-id' },
      global: {
        stubs: {
          TopNavigation: true,
          PageFooter: true,
          CommentForm: true,
          CommentList: true,
          ToggleSortTypeButton: true,
          BanDialog: true,
          IEpEdit: true,
          IEpDelete: true,
          IMdiThumbUp: true,
          IMdiThumbUpOutline: true,
          RouterLink: true,
        },
      },
    })
    expect(wrapper.props('postId')).toBe('test-post-id')
  })
})
