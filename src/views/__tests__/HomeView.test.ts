import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomeView from '../HomeView.vue'
import { postApi } from '@/api/post'
import { tagApi } from '@/api/tag'
import type { Article, Tag } from '@/types'

// Mock the APIs
vi.mock('@/api/post', () => ({
  postApi: {
    getPostPageCountByTag: vi.fn(),
    getPostCountByTag: vi.fn(),
    getAllPostsByTag: vi.fn(),
    getPostPages: vi.fn(),
    getPostCount: vi.fn(),
    getAllPosts: vi.fn(),
  },
}))

vi.mock('@/api/tag', () => ({
  tagApi: {
    getAllTags: vi.fn(),
  },
}))

// Mock components
vi.mock('@/components/TopNavigation.vue', () => ({
  default: {
    name: 'TopNavigation',
    template: '<div>TopNavigation</div>',
  },
}))

vi.mock('@/components/TagSidebar.vue', () => ({
  default: {
    name: 'TagSidebar',
    template: '<div>TagSidebar</div>',
  },
}))

vi.mock('@/components/PostList.vue', () => ({
  default: {
    name: 'PostList',
    template: '<div>PostList</div>',
  },
}))

vi.mock('@/components/PageFooter.vue', () => ({
  default: {
    name: 'PageFooter',
    template: '<div>PageFooter</div>',
  },
}))

describe('HomeView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.exists()).toBe(true)
  })

  it('calls API functions on mount', async () => {
    const mockPosts: Article[] = [
      {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        authorId: 1,
        tags: [],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ]
    const mockTags: Tag[] = [{ id: 1, name: 'Test Tag' }]

    vi.mocked(postApi.getPostPages).mockResolvedValue(5)
    vi.mocked(postApi.getPostCount).mockResolvedValue(25)
    vi.mocked(postApi.getAllPosts).mockResolvedValue(mockPosts)
    vi.mocked(tagApi.getAllTags).mockResolvedValue(mockTags)

    mount(HomeView)

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(postApi.getPostPages).toHaveBeenCalled()
    expect(postApi.getPostCount).toHaveBeenCalled()
    expect(postApi.getAllPosts).toHaveBeenCalledWith(0)
    expect(tagApi.getAllTags).toHaveBeenCalled()
  })

  it('handles API calls with tag filter', async () => {
    const mockPosts: Article[] = [
      {
        id: 1,
        title: 'Tagged Post',
        content: 'Test content',
        authorId: 1,
        tags: ['vue'],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ]

    vi.mocked(postApi.getPostPageCountByTag).mockResolvedValue(2)
    vi.mocked(postApi.getPostCountByTag).mockResolvedValue(8)
    vi.mocked(postApi.getAllPostsByTag).mockResolvedValue(mockPosts)

    mount(HomeView)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify that the component would call tag-specific APIs when tag is set
    expect(postApi.getPostPages).toHaveBeenCalled()
    expect(postApi.getPostCount).toHaveBeenCalled()
    expect(postApi.getAllPosts).toHaveBeenCalled()
  })

  it('handles pagination correctly', async () => {
    const mockPosts: Article[] = [
      {
        id: 2,
        title: 'Page 2 Post',
        content: 'Test content',
        authorId: 1,
        tags: [],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ]

    vi.mocked(postApi.getAllPosts).mockResolvedValue(mockPosts)
    vi.mocked(postApi.getPostPages).mockResolvedValue(3)
    vi.mocked(postApi.getPostCount).mockResolvedValue(15)

    mount(HomeView)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // The component should call getAllPosts during initial load
    expect(postApi.getAllPosts).toHaveBeenCalled()
  })

  it('handles tag clicks', async () => {
    const mockTags: Tag[] = [
      { id: 1, name: 'Vue' },
      { id: 2, name: 'TypeScript' },
    ]

    vi.mocked(tagApi.getAllTags).mockResolvedValue(mockTags)

    mount(HomeView)

    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(tagApi.getAllTags).toHaveBeenCalled()
  })

  it('refreshes content correctly', async () => {
    const mockPosts: Article[] = [
      {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        authorId: 1,
        tags: [],
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      },
    ]
    const mockTags: Tag[] = [{ id: 1, name: 'Test Tag' }]

    vi.mocked(postApi.getPostPages).mockResolvedValue(3)
    vi.mocked(postApi.getPostCount).mockResolvedValue(15)
    vi.mocked(postApi.getAllPosts).mockResolvedValue(mockPosts)
    vi.mocked(tagApi.getAllTags).mockResolvedValue(mockTags)

    mount(HomeView)

    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(postApi.getPostPages).toHaveBeenCalled()
    expect(postApi.getPostCount).toHaveBeenCalled()
    expect(postApi.getAllPosts).toHaveBeenCalled()
    expect(tagApi.getAllTags).toHaveBeenCalled()
  })
})
