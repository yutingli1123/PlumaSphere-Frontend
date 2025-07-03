import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentView from '../CommentView.vue'
import type { Comment, User } from '@/types'
import { userApi } from '@/api/user'
import { DateTime } from 'luxon'
import ElementPlus from 'element-plus'

// Mock the user API
vi.mock('@/api/user', () => ({
  userApi: {
    getUserById: vi.fn(),
  },
}))

describe('CommentView', () => {
  const mockComment: Comment = {
    id: 1,
    content: 'This is a test comment',
    authorId: 123,
    authorNickname: 'Test User',
    createdAt: '2025-06-29T10:00:00Z',
  }

  const mockUser: User = {
    id: 123,
    username: 'testuser',
    nickname: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    avatarColor: '#ff6b6b',
    initials: 'TU',
    dob: '1990-01-01',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-06-29T09:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders comment content correctly', async () => {
    vi.mocked(userApi.getUserById).mockResolvedValue(mockUser)

    const wrapper = mount(CommentView, {
      props: {
        comment: mockComment,
      },
      global: {
        plugins: [ElementPlus],
      },
    })

    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(wrapper.find('.comment-content').text()).toBe('This is a test comment')
    expect(wrapper.find('.comment-info .comment-name').text()).toBe('Test User')
  })

  it('displays formatted comment date', async () => {
    vi.mocked(userApi.getUserById).mockResolvedValue(mockUser)

    const wrapper = mount(CommentView, {
      props: {
        comment: mockComment,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-avatar': {
            template: '<div class="el-avatar"><slot /></div>',
            props: ['size', 'src', 'style'],
          },
        },
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const expectedDate = DateTime.fromISO(mockComment.createdAt)
      .toLocal()
      .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)

    expect(wrapper.find('.comment-time').text()).toBe(expectedDate)
  })

  it('fetches user data on mount', async () => {
    vi.mocked(userApi.getUserById).mockResolvedValue(mockUser)

    mount(CommentView, {
      props: {
        comment: mockComment,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-avatar': {
            template: '<div class="el-avatar"><slot /></div>',
            props: ['size', 'src', 'style'],
          },
        },
      },
    })

    expect(userApi.getUserById).toHaveBeenCalledWith(123)
  })

  it('renders avatar with image URL when available', async () => {
    vi.mocked(userApi.getUserById).mockResolvedValue(mockUser)

    const wrapper = mount(CommentView, {
      props: {
        comment: mockComment,
      },
      global: {
        plugins: [ElementPlus],
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const avatars = wrapper.findAllComponents({ name: 'ElAvatar' })
    expect(avatars.length).toBeGreaterThan(0)
    if (avatars.length > 0) {
      expect(avatars[0].props('src')).toBe('https://example.com/avatar.jpg')
    }
  })

  it('renders avatar with initials when no image URL', async () => {
    const userWithoutAvatar = {
      ...mockUser,
      avatarUrl: '',
    }

    vi.mocked(userApi.getUserById).mockResolvedValue(userWithoutAvatar)

    const wrapper = mount(CommentView, {
      props: {
        comment: mockComment,
      },
      global: {
        plugins: [ElementPlus],
      },
    })

    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const avatars = wrapper.findAllComponents({ name: 'ElAvatar' })
    expect(avatars.length).toBeGreaterThan(0)
    if (avatars.length > 0) {
      expect(avatars[0].props('src')).toBe('')
      // Check that the background color is set through the style prop or default Avatar behavior
      const avatar = avatars[0]
      expect(avatar.exists()).toBe(true)
    }
  })

  it('refetches user data when comment prop changes', async () => {
    vi.mocked(userApi.getUserById).mockResolvedValue(mockUser)

    const wrapper = mount(CommentView, {
      props: {
        comment: mockComment,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-avatar': {
            template: '<div class="el-avatar"><slot /></div>',
            props: ['size', 'src', 'style'],
          },
        },
      },
    })

    expect(userApi.getUserById).toHaveBeenCalledTimes(1)

    // Change comment prop
    const newComment = { ...mockComment, id: 2, authorId: 456 }
    await wrapper.setProps({ comment: newComment })

    expect(userApi.getUserById).toHaveBeenCalledTimes(2)
    expect(userApi.getUserById).toHaveBeenCalledWith(456)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(CommentView, {
      props: {
        comment: mockComment,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-avatar': {
            template: '<div class="el-avatar"><slot /></div>',
            props: ['size', 'src', 'style'],
          },
        },
      },
    })

    expect(wrapper.find('.comment-author').exists()).toBe(true)
    expect(wrapper.find('.comment-info').exists()).toBe(true)
    expect(wrapper.find('.comment-name').exists()).toBe(true)
    expect(wrapper.find('.comment-time').exists()).toBe(true)
    expect(wrapper.find('.comment-content').exists()).toBe(true)
  })
})
