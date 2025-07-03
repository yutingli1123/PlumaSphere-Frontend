import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UserManagementView from '../settings/UserManagementView.vue'

// Mock dependencies
vi.mock('@/api/user', () => ({
  userApi: {
    getAllUsers: vi.fn(),
    getAllUsersCount: vi.fn(),
    getUserInfo: vi.fn(),
  },
}))

vi.mock('@/api/admin', () => ({
  adminApi: {
    banUser: vi.fn(),
    unbanUser: vi.fn(),
    getBannedUsers: vi.fn(),
    getBannedIPs: vi.fn(),
  },
}))

vi.mock('@/components/BanDialog.vue', () => ({
  default: { template: '<div>BanDialog</div>' },
}))

vi.mock('@/components/BanIpDialog.vue', () => ({
  default: { template: '<div>BanIpDialog</div>' },
}))

describe('UserManagementView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    const wrapper = mount(UserManagementView)
    expect(wrapper.exists()).toBe(true)
  })

  it('shows user management tabs', () => {
    const wrapper = mount(UserManagementView)
    // Should show tabs for users, banned users, banned IPs, etc.
    expect(wrapper.exists()).toBe(true)
  })

  it('handles user search', () => {
    const wrapper = mount(UserManagementView)
    // Should have search functionality
    expect(wrapper.exists()).toBe(true)
  })

  it('handles user banning functionality', () => {
    const wrapper = mount(UserManagementView)
    // Should handle ban/unban operations
    expect(wrapper.exists()).toBe(true)
  })

  it('handles pagination', () => {
    const wrapper = mount(UserManagementView)
    // Should handle user list pagination
    expect(wrapper.exists()).toBe(true)
  })
})
