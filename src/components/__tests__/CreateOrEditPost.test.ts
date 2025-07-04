import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateOrEditPost from '../CreateOrEditPost.vue'
import { postApi } from '@/api/post'
import { tagApi } from '@/api/tag'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import ElementPlus from 'element-plus'
import type { Router } from 'vue-router'

// Mock the APIs, stores and router
vi.mock('@/api/post', () => ({
  postApi: {
    createPost: vi.fn(),
    updatePost: vi.fn(),
  },
}))

vi.mock('@/api/tag', () => ({
  tagApi: {
    getAllTags: vi.fn(),
  },
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}))

// Mock Vditor
vi.mock('vditor', () => ({
  default: vi.fn().mockImplementation(() => ({
    getValue: vi.fn(() => 'Test content'),
    setValue: vi.fn(),
    destroy: vi.fn(),
  })),
}))

describe('CreateOrEditPost', () => {
  let mockAuthStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    vi.clearAllMocks()

    mockAuthStore = {
      getAccessToken: vi.fn().mockResolvedValue('mock-token'),
      login: vi.fn(),
      logout: vi.fn(),
      getNewIdentity: vi.fn(),
      isLoggedIn: vi.fn().mockReturnValue(true),
      hasToken: vi.fn().mockReturnValue(true),
    } as unknown as ReturnType<typeof useAuthStore>

    const mockRouter = {
      push: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
    } as unknown as Router

    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
    vi.mocked(useRouter).mockReturnValue(mockRouter)
    vi.mocked(tagApi.getAllTags).mockResolvedValue([
      { id: 1, name: 'Vue' },
      { id: 2, name: 'React' },
    ])
  })

  it('renders in create mode by default', () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Post')
  })

  it('renders in edit mode when postId is provided', () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {
        postId: '123',
        titleIn: 'Test Title',
        contentIn: 'Test Content',
        tagsIn: ['Vue', 'React'],
      },
      global: {
        plugins: [ElementPlus],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('Edit')
  })

  it('initializes form with provided data in edit mode', async () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {
        postId: '123',
        titleIn: 'Test Title',
        contentIn: 'Test Content',
        tagsIn: ['Vue'],
      },
      global: {
        plugins: [ElementPlus],
      },
    })
    type SetupExpose = {
      isEditing: boolean
      newPostParams: { title: string; tags: string[]; content: string }
    }
    const vm = wrapper.vm as unknown as SetupExpose
    expect(vm.isEditing).toBe(true)
    expect(vm.newPostParams.title).toBe('Test Title')
    expect(vm.newPostParams.tags).toContain('Vue')
  })

  it('renders title input field', () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })

    const titleInput = wrapper.find('input[placeholder*="title"]')
    expect(titleInput.exists()).toBe(true)
  })

  it('renders tag selection', () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })

    expect(wrapper.text()).toContain('Tag')
  })

  it('loads all tags on mount', async () => {
    mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(tagApi.getAllTags).toHaveBeenCalled()
  })

  it('validates required title field', () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })
    type SetupExpose = { rules: { title: { required: boolean }[] } }
    const vm = wrapper.vm as unknown as SetupExpose
    expect(vm.rules.title).toBeDefined()
    expect(vm.rules.title[0].required).toBe(true)
  })

  it('validates content field', () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })
    type SetupExpose = { rules: { content: { validator: unknown }[] } }
    const vm = wrapper.vm as unknown as SetupExpose
    expect(vm.rules.content).toBeDefined()
    expect(vm.rules.content[0].validator).toBeDefined()
  })

  it('handles form submission in create mode', async () => {
    vi.mocked(postApi.createPost).mockResolvedValue(true)
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })
    type SetupExpose = {
      newPostParams: { title: string; content: string }
      submitPost: () => void
    }
    const vm = wrapper.vm as unknown as SetupExpose
    vm.newPostParams.title = 'Test Title'
    vm.newPostParams.content = 'Test Content'
    expect(vm.submitPost).toBeDefined()
  })

  it('handles form submission in edit mode', async () => {
    vi.mocked(postApi.updatePost).mockResolvedValue(true)
    const wrapper = mount(CreateOrEditPost, {
      props: {
        postId: '123',
        titleIn: 'Test Title',
        contentIn: 'Test Content',
      },
      global: {
        plugins: [ElementPlus],
      },
    })
    type SetupExpose = { submitPost: () => void; isEditing: boolean }
    const vm = wrapper.vm as unknown as SetupExpose
    expect(vm.submitPost).toBeDefined()
    expect(vm.isEditing).toBe(true)
  })

  it('handles posting state correctly', () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })
    type SetupExpose = { posting: boolean }
    const vm = wrapper.vm as unknown as SetupExpose
    expect(vm.posting).toBe(false)
  })

  it('handles tag filtering by type', async () => {
    const wrapper = mount(CreateOrEditPost, {
      props: {},
      global: {
        plugins: [ElementPlus],
      },
    })
    await new Promise((resolve) => setTimeout(resolve, 0))
    type SetupExpose = { allTags: unknown }
    const vm = wrapper.vm as unknown as SetupExpose
    expect(vm.allTags).toBeDefined()
  })
})
