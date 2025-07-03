import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BanIpDialog from '../BanIpDialog.vue'
import { adminApi } from '@/api/admin'
import ElementPlus from 'element-plus'

// Mock the admin API
vi.mock('@/api/admin', () => ({
  adminApi: {
    banIp: vi.fn(),
  },
}))

describe('BanIpDialog', () => {
  const defaultProps = {
    closeDialog: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form with IP address input', () => {
    const wrapper = mount(BanIpDialog, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    expect(wrapper.find('input[placeholder*="IP address"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('IP Address')
    expect(wrapper.text()).toContain('Reason')
    expect(wrapper.text()).toContain('Expiration')
  })

  it('renders reason input field', () => {
    const wrapper = mount(BanIpDialog, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const reasonInput = wrapper.find('input[placeholder*="reason"]')
    expect(reasonInput.exists()).toBe(true)
  })

  it('renders ban IP button', () => {
    const wrapper = mount(BanIpDialog, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const buttons = wrapper.findAll('button')
    const banButton = buttons.find((btn) => btn.text() === 'Ban IP')
    expect(banButton).toBeTruthy()
  })

  it('calls banIp API when ban button is confirmed', async () => {
    const mockValidate = vi.fn((callback) => callback(true))
    vi.mocked(adminApi.banIp).mockResolvedValue('IP banned successfully')

    const wrapper = mount(BanIpDialog, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-form': {
            template: '<div><slot /></div>',
            methods: {
              validate: mockValidate,
            },
          },
        },
      },
    })

    // Call the banIp method directly
    const component = wrapper.vm as {
      banIp?: () => Promise<void>
      rules?: { address?: unknown[]; reason?: unknown[] }
      formData?: { address?: string; reason?: string }
    }
    if (component.banIp) {
      await component.banIp()
    }
    await wrapper.vm.$nextTick()

    expect(mockValidate).toHaveBeenCalled()
    expect(adminApi.banIp).toHaveBeenCalled()
    expect(defaultProps.closeDialog).toHaveBeenCalled()
  })

  it('validates required fields', async () => {
    const wrapper = mount(BanIpDialog, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    // Check that form validation rules exist
    const component = wrapper.vm as {
      banIp?: () => Promise<void>
      rules?: { address?: unknown[]; reason?: unknown[] }
      formData?: { address?: string; reason?: string }
    }
    expect(component.rules).toBeDefined()
    expect(component.rules?.address).toBeDefined()
    expect(component.rules?.reason).toBeDefined()
    expect((component.rules?.address?.[0] as { required?: boolean })?.required).toBe(true)
    expect((component.rules?.reason?.[0] as { required?: boolean })?.required).toBe(true)
  })

  it('handles form data correctly', async () => {
    const wrapper = mount(BanIpDialog, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
      },
    })

    const component = wrapper.vm as {
      banIp?: () => Promise<void>
      rules?: { address?: unknown[]; reason?: unknown[] }
      formData?: { address?: string; reason?: string }
    }
    expect(component.formData).toBeDefined()
    expect(component.formData?.address).toBe('')
    expect(component.formData?.reason).toBe('')
  })
})
