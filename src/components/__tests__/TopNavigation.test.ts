import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { createPinia } from 'pinia'
import TopNavigation from '../TopNavigation.vue'
import { useAuthStore } from '@/stores/auth'
import { useConfigStore } from '@/stores/config'
import { ConfigFiled } from '@/constant'
import ElementPlus from 'element-plus'

// Mock the stores
vi.mock('@/stores/auth', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/stores/config', () => ({
  useConfigStore: vi.fn(),
}))

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('TopNavigation', () => {
  let pinia: ReturnType<typeof createPinia>
  let mockAuthStore: {
    isLoggedIn: ReturnType<typeof vi.fn>
    logout: ReturnType<typeof vi.fn>
    login: ReturnType<typeof vi.fn>
    getAccessToken: ReturnType<typeof vi.fn>
    getNewIdentity: ReturnType<typeof vi.fn>
    hasToken: ReturnType<typeof vi.fn>
  }
  let mockConfigStore: ReturnType<typeof useConfigStore>

  beforeEach(() => {
    pinia = createPinia()

    mockAuthStore = {
      login: vi.fn(),
      logout: vi.fn(),
      getAccessToken: vi.fn(),
      getNewIdentity: vi.fn(),
      isLoggedIn: vi.fn(),
      hasToken: vi.fn(),
    }

    mockConfigStore = {
      getConfig: vi.fn(),
      setConfig: vi.fn(),
    } as unknown as ReturnType<typeof useConfigStore>

    vi.mocked(useAuthStore).mockReturnValue(
      mockAuthStore as unknown as ReturnType<typeof useAuthStore>,
    )
    vi.mocked(useConfigStore).mockReturnValue(mockConfigStore)

    vi.clearAllMocks()
    mockPush.mockClear()

    vi.spyOn(mockConfigStore, 'getConfig').mockImplementation((key: string) => {
      if (key === ConfigFiled.BLOG_TITLE) return 'Test Blog'
      if (key === ConfigFiled.BLOG_SUBTITLE) return 'Test Subtitle'
      return null
    })
  })

  it('renders navigation with title and subtitle', () => {
    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
          'el-input': {
            template: '<input :placeholder="placeholder" />',
            props: ['placeholder', 'prefixIcon', 'clearable', 'modelValue'],
            emits: ['update:modelValue', 'keydown'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type', 'size', 'icon', 'text'],
          },
        },
      },
    })

    expect(wrapper.find('.main-title').text()).toBe('Test Blog')
    expect(wrapper.find('.subtitle').text()).toBe('Test Subtitle')
  })

  it('shows login button when user is not logged in', () => {
    mockAuthStore.isLoggedIn.mockReturnValue(false)

    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
          'el-input': {
            template: '<input :placeholder="placeholder" />',
            props: ['placeholder', 'prefixIcon', 'clearable', 'modelValue'],
            emits: ['update:modelValue', 'keydown'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type', 'size', 'icon', 'text'],
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const loginButton = buttons.find((btn) => btn.text() === 'Login')
    expect(loginButton).toBeTruthy()
  })

  it('shows user actions when user is logged in', () => {
    mockAuthStore.isLoggedIn.mockReturnValue(true)

    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
          'el-input': {
            template: '<input :placeholder="placeholder" />',
            props: ['placeholder', 'prefixIcon', 'clearable', 'modelValue'],
            emits: ['update:modelValue', 'keydown'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type', 'size', 'icon', 'text'],
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const newPostButton = buttons.find((btn) => btn.text() === 'New Post')
    const logoutButton = buttons.find((btn) => btn.text() === 'Logout')

    expect(newPostButton).toBeTruthy()
    expect(logoutButton).toBeTruthy()
  })

  it('navigates to create post when New Post button is clicked', async () => {
    mockAuthStore.isLoggedIn.mockReturnValue(true)

    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
          'el-input': {
            template: '<input :placeholder="placeholder" />',
            props: ['placeholder', 'prefixIcon', 'clearable', 'modelValue'],
            emits: ['update:modelValue', 'keydown'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type', 'size', 'icon', 'text'],
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const newPostButton = buttons.find((btn) => btn.text() === 'New Post')

    if (newPostButton) {
      await newPostButton.trigger('click')
      expect(mockPush).toHaveBeenCalledWith({ path: '/create-post' })
    }
  })

  it('navigates to settings when settings button is clicked', async () => {
    mockAuthStore.isLoggedIn.mockReturnValue(true)

    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
          'el-input': {
            template: '<input :placeholder="placeholder" />',
            props: ['placeholder', 'prefixIcon', 'clearable', 'modelValue'],
            emits: ['update:modelValue', 'keydown'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type', 'size', 'icon', 'text'],
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    // Settings button is the last one (icon button)
    const settingsButton = buttons[buttons.length - 1]

    await settingsButton.trigger('click')
    expect(mockPush).toHaveBeenCalledWith({ path: '/settings' })
  })

  it('calls logout when logout button is clicked', async () => {
    mockAuthStore.isLoggedIn.mockReturnValue(true)

    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
        },
      },
    })

    const buttons = wrapper.findAll('.el-button')
    const logoutButton = buttons.find((btn) => btn.text() === 'Logout')

    if (logoutButton) {
      await logoutButton.trigger('click')
      expect(mockAuthStore.logout).toHaveBeenCalledTimes(1)
    }
  })

  it('renders search input with correct placeholder', () => {
    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
          'el-input': {
            template: '<input :placeholder="placeholder" />',
            props: ['placeholder', 'prefixIcon', 'clearable', 'modelValue'],
            emits: ['update:modelValue', 'keydown'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type', 'size', 'icon', 'text'],
          },
        },
      },
    })

    const searchInput = wrapper.find('input')
    expect(searchInput.attributes('placeholder')).toBe('Search...')
  })

  it('creates router link to home page', () => {
    const wrapper = mount(TopNavigation, {
      global: {
        plugins: [pinia, ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          LoginDialog: true,
          'el-input': true,
          'el-button': true,
        },
      },
    })

    const routerLink = wrapper.findComponent(RouterLinkStub)
    expect(routerLink.props('to')).toBe('/')
  })
})
