import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SearchView from '../SearchView.vue'

// Mock dependencies
vi.mock('@/api/post', () => ({
  postApi: {
    getAllPostsBySearchQuery: vi.fn(() => Promise.resolve([])),
    getPostCountBySearchQuery: vi.fn(() => Promise.resolve(0)),
    getPostPageCountBySearchQuery: vi.fn(() => Promise.resolve(0)),
  },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('SearchView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = shallowMount(SearchView, {
      props: { query: 'test', page: 1 },
      global: {
        stubs: {
          TopNavigation: true,
          PageFooter: true,
          PostList: true,
          'el-empty': true,
          'el-pagination': true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('handles empty query', () => {
    const wrapper = shallowMount(SearchView, {
      props: { query: '', page: 1 },
      global: {
        stubs: {
          TopNavigation: true,
          PageFooter: true,
          PostList: true,
          'el-empty': true,
          'el-pagination': true,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('handles pagination', () => {
    const wrapper = shallowMount(SearchView, {
      props: { query: 'vue', page: 2 },
      global: {
        stubs: {
          TopNavigation: true,
          PageFooter: true,
          PostList: true,
          'el-empty': true,
          'el-pagination': true,
        },
      },
    })
    expect(wrapper.props('page')).toBe(2)
  })

  it('initializes with correct props', () => {
    const wrapper = shallowMount(SearchView, {
      props: { query: 'javascript', page: 3 },
      global: {
        stubs: {
          TopNavigation: true,
          PageFooter: true,
          PostList: true,
          'el-empty': true,
          'el-pagination': true,
        },
      },
    })
    expect(wrapper.props('query')).toBe('javascript')
    expect(wrapper.props('page')).toBe(3)
  })
})
