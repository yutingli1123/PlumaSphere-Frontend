import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ToggleSortTypeButton from '../ToggleSortTypeButton.vue'
import { SortBy } from '@/constant'
import ElementPlus from 'element-plus'

describe('ToggleSortTypeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with TIME sort type', () => {
    const toggleSortBy = vi.fn()
    const wrapper = mount(ToggleSortTypeButton, {
      props: {
        toggleSortBy,
        sortBy: SortBy.TIME,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'i-ep-sort': true,
          'el-icon': true,
          'el-button': {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.find('.sort-type').text()).toBe(SortBy.TIME)
    expect(wrapper.find('.sort-icon').classes()).not.toContain('rotated')
  })

  it('renders correctly with LIKE sort type', () => {
    const toggleSortBy = vi.fn()
    const wrapper = mount(ToggleSortTypeButton, {
      props: {
        toggleSortBy,
        sortBy: SortBy.LIKE,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'i-ep-sort': true,
          'el-icon': true,
          'el-button': {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.find('.sort-type').text()).toBe(SortBy.LIKE)
    expect(wrapper.find('.sort-icon').classes()).toContain('rotated')
  })

  it('calls toggleSortBy when clicked', async () => {
    const toggleSortBy = vi.fn()
    const wrapper = mount(ToggleSortTypeButton, {
      props: {
        sortBy: SortBy.TIME,
        toggleSortBy,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'i-ep-sort': true,
          'el-icon': true,
        },
      },
    })

    await wrapper.findComponent({ name: 'ElButton' }).trigger('click')
    expect(toggleSortBy).toHaveBeenCalledTimes(1)
  })

  it('displays correct sort by text', () => {
    const toggleSortBy = vi.fn()
    const wrapper = mount(ToggleSortTypeButton, {
      props: {
        toggleSortBy,
        sortBy: SortBy.TIME,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'i-ep-sort': true,
          'el-icon': true,
          'el-button': {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Sort by:')
    expect(wrapper.text()).toContain(SortBy.TIME)
  })
})
