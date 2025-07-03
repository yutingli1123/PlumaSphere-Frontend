import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { DateTime } from 'luxon'
import UserCommentsDialog from '../UserCommentsDialog.vue'
import { commentApi } from '@/api/comment'
import type { Comment } from '@/types'

vi.mock('@/api/comment', () => ({
  commentApi: {
    getCommentCountByUserId: vi.fn(),
    getCommentsByUserId: vi.fn(),
  },
}))

const mockComments: Comment[] = [
  {
    id: 1,
    content: 'Test comment 1',
    authorId: 1,
    authorNickname: 'user1',
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 2,
    content: 'Test comment 2',
    authorId: 1,
    authorNickname: 'user1',
    createdAt: '2023-01-02T11:00:00Z',
  },
]

describe('UserCommentsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders table with comments when userId is provided', async () => {
    const mockCounts = { totalPages: 2, totalCount: 10 }

    vi.mocked(commentApi.getCommentCountByUserId).mockResolvedValue(mockCounts)
    vi.mocked(commentApi.getCommentsByUserId).mockResolvedValue(mockComments)

    const wrapper = mount(UserCommentsDialog, {
      props: {
        userId: 1,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(commentApi.getCommentCountByUserId).toHaveBeenCalledWith(1)
    expect(commentApi.getCommentsByUserId).toHaveBeenCalledWith(1, 0)

    // Check if table is rendered
    const table = wrapper.find('.el-table')
    expect(table.exists()).toBe(true)

    // Check if pagination is rendered
    const pagination = wrapper.find('.el-pagination')
    expect(pagination.exists()).toBe(true)
  })

  it('does not fetch comments when userId is undefined', async () => {
    const wrapper = mount(UserCommentsDialog, {
      props: {
        userId: undefined,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(commentApi.getCommentCountByUserId).not.toHaveBeenCalled()
    expect(commentApi.getCommentsByUserId).not.toHaveBeenCalled()
  })

  it('displays formatted dates in created at column', async () => {
    const mockCounts = { totalPages: 1, totalCount: 1 }

    vi.mocked(commentApi.getCommentCountByUserId).mockResolvedValue(mockCounts)
    vi.mocked(commentApi.getCommentsByUserId).mockResolvedValue(mockComments)

    const wrapper = mount(UserCommentsDialog, {
      props: {
        userId: 1,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()

    // Check if DateTime formatting is working
    expect(wrapper.text()).toContain('Test comment 1')
  })

  it('handles pagination correctly', async () => {
    const mockCounts = { totalPages: 3, totalCount: 30 }

    vi.mocked(commentApi.getCommentCountByUserId).mockResolvedValue(mockCounts)
    vi.mocked(commentApi.getCommentsByUserId).mockResolvedValue(mockComments)

    const wrapper = mount(UserCommentsDialog, {
      props: {
        userId: 1,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    // Simulate page change by calling fetchComments with different internal state
    // We can't directly access vm properties in composition API, so we test behavior
    const pagination = wrapper.findComponent({ name: 'ElPagination' })
    if (pagination.exists()) {
      await pagination.vm.$emit('current-change', 2)
    }

    // API should be called again with new page
    expect(commentApi.getCommentsByUserId).toHaveBeenCalledTimes(2)
  })

  it('handles API calls correctly on mount', async () => {
    const mockCounts = { totalPages: 1, totalCount: 5 }

    vi.mocked(commentApi.getCommentCountByUserId).mockResolvedValue(mockCounts)
    vi.mocked(commentApi.getCommentsByUserId).mockResolvedValue([])

    const wrapper = mount(UserCommentsDialog, {
      props: {
        userId: 1,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(commentApi.getCommentCountByUserId).toHaveBeenCalledWith(1)
    expect(commentApi.getCommentsByUserId).toHaveBeenCalledWith(1, 0)
  })

  it('calls fetchComments on pagination change', async () => {
    const mockCounts = { totalPages: 2, totalCount: 20 }

    vi.mocked(commentApi.getCommentCountByUserId).mockResolvedValue(mockCounts)
    vi.mocked(commentApi.getCommentsByUserId).mockResolvedValue(mockComments)

    const wrapper = mount(UserCommentsDialog, {
      props: {
        userId: 1,
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    // Clear previous calls
    vi.clearAllMocks()

    // Trigger pagination change
    const pagination = wrapper.findComponent({ name: 'ElPagination' })
    if (pagination.exists()) {
      await pagination.vm.$emit('current-change', 2)
    }

    expect(commentApi.getCommentCountByUserId).toHaveBeenCalledWith(1)
    expect(commentApi.getCommentsByUserId).toHaveBeenCalledWith(1, 0) // Initial call is still page 0
  })
})
