import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import CommentForm from '../CommentForm.vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import ElementPlus from 'element-plus'

// Mock the APIs and stores
vi.mock('@/api/comment', () => ({
  commentApi: {
    addComment: vi.fn(),
  },
}))

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}))

describe('CommentForm', () => {
  let pinia: ReturnType<typeof createPinia>
  let mockUserStore: ReturnType<typeof useUserStore>
  let mockAuthStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    pinia = createPinia()

    mockUserStore = {
      user: null,
      getUserInfo: vi.fn(),
      clearUserInfo: vi.fn(),
      fetchUserInfo: vi.fn(),
    } as unknown as ReturnType<typeof useUserStore>

    mockAuthStore = {
      getNewIdentity: vi.fn(),
      getAccessToken: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      isLoggedIn: vi.fn(),
      hasToken: vi.fn(),
    } as unknown as ReturnType<typeof useAuthStore>

    vi.mocked(useUserStore).mockReturnValue(mockUserStore)
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)

    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  const defaultProps = {
    postId: '123',
  }

  it('renders correctly when user is not authenticated', () => {
    const wrapper = mount(CommentForm, {
      props: defaultProps,
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          IEpUser: true,
        },
      },
    })

    expect(wrapper.find('.el-button').text()).toContain('Get Identity')
    expect(wrapper.find('.el-button').attributes('disabled')).toBeUndefined()
  })

  it('renders correctly when user is authenticated', () => {
    // Mock user for this specific test
    vi.spyOn(mockUserStore, 'user', 'get').mockReturnValue({
      id: 1,
      username: 'testuser',
      nickname: 'Test User',
      bio: '',
      avatarUrl: '',
      avatarColor: '',
      initials: '',
      dob: '',
      createdAt: '',
      updatedAt: '',
      lastLoginAt: '',
    })

    const wrapper = mount(CommentForm, {
      props: defaultProps,
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          IEpUser: true,
        },
      },
    })

    expect(wrapper.find('.el-button').text()).toContain('Comment as: Test User')
    expect(wrapper.find('.el-button').attributes('disabled')).toBeDefined()
  })

  it('calls getNewIdentity when identity button is clicked', async () => {
    const wrapper = mount(CommentForm, {
      props: defaultProps,
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          IEpUser: true,
        },
      },
    })

    await wrapper.find('.el-button').trigger('click')
    expect(mockAuthStore.getNewIdentity).toHaveBeenCalledTimes(1)
  })

  it('calls getUserInfo on mount', () => {
    mount(CommentForm, {
      props: defaultProps,
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          IEpUser: true,
          'el-button': true,
          'el-input': true,
        },
      },
    })

    expect(mockUserStore.getUserInfo).toHaveBeenCalledTimes(1)
  })

  it('disables submit button when no comment content', () => {
    // Mock user for this specific test
    vi.spyOn(mockUserStore, 'user', 'get').mockReturnValue({
      id: 1,
      username: 'testuser',
      nickname: 'Test User',
      bio: '',
      avatarUrl: '',
      avatarColor: '',
      initials: '',
      dob: '',
      createdAt: '',
      updatedAt: '',
      lastLoginAt: '',
    })

    const wrapper = mount(CommentForm, {
      props: defaultProps,
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          IEpUser: true,
          'el-button': {
            template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
            props: ['disabled'],
          },
          'el-input': {
            template: '<textarea :disabled="disabled" :placeholder="placeholder"></textarea>',
            props: ['disabled', 'placeholder'],
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const submitButton = buttons[1] // Second button should be submit button
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
})
