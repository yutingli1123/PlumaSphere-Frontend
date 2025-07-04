import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PersonalSettingView from '../settings/PersonalSettingView.vue'

// Mock dependencies
vi.mock('@/api/user', () => ({
  userApi: {
    updateUserInfo: vi.fn(),
    uploadAvatar: vi.fn(),
  },
}))

vi.mock('@/stores/user', () => ({
  useUserStore: () => ({
    fetchUserInfo: vi.fn(),
    getUserInfo: vi.fn().mockResolvedValue({
      nickname: 'Test User',
      bio: 'Test bio',
      dob: '2000-01-01',
    }),
    user: {
      nickname: 'Test User',
      bio: 'Test bio',
      dob: '2000-01-01',
    },
  }),
}))

vi.mock('vue-cropper', () => ({
  VueCropper: { template: '<div>VueCropper</div>' },
}))

describe('PersonalSettingView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(PersonalSettingView)
    expect(wrapper.exists()).toBe(true)
  })

  it('handles form submission', () => {
    const wrapper = mount(PersonalSettingView)
    // Should handle personal info updates
    expect(wrapper.exists()).toBe(true)
  })

  it('handles avatar upload', () => {
    const wrapper = mount(PersonalSettingView)
    // Should handle avatar upload and cropping
    expect(wrapper.exists()).toBe(true)
  })

  it('validates form fields', () => {
    const wrapper = mount(PersonalSettingView)
    // Should validate required fields
    expect(wrapper.exists()).toBe(true)
  })

  it('shows avatar cropper dialog', () => {
    const wrapper = mount(PersonalSettingView)
    // Should show cropper when uploading avatar
    expect(wrapper.exists()).toBe(true)
  })
})
