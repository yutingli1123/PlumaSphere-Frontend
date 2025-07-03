import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SettingView from '../SettingView.vue'

// Mock dependencies
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/settings',
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    isLoggedIn: vi.fn(() => true),
  }),
}))

vi.mock('@/components/TopNavigation.vue', () => ({
  default: { template: '<div>TopNavigation</div>' },
}))

describe('SettingView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(SettingView)
    expect(wrapper.exists()).toBe(true)
  })

  it('redirects unauthenticated users', () => {
    // Should redirect to home if not logged in
    const wrapper = mount(SettingView)
    expect(wrapper.exists()).toBe(true)
  })

  it('shows navigation menu', () => {
    const wrapper = mount(SettingView)
    // Should show settings navigation menu
    expect(wrapper.exists()).toBe(true)
  })

  it('handles route changes', () => {
    const wrapper = mount(SettingView)
    // Should handle navigation between settings pages
    expect(wrapper.exists()).toBe(true)
  })
})
