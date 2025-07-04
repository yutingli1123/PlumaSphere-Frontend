import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TagSidebar from '../TagSidebar.vue'
import type { Tag } from '@/types'
import ElementPlus from 'element-plus'

describe('TagSidebar', () => {
  const mockTags: Tag[] = [
    { id: 1, name: 'Vue', postCount: 10 },
    { id: 2, name: 'TypeScript', postCount: 8 },
    { id: 3, name: 'Testing', postCount: 5 },
  ]

  it('renders tag sidebar with tags', () => {
    const wrapper = mount(TagSidebar, {
      props: {
        tags: mockTags,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-menu': {
            template: '<ul class="el-menu"><slot /></ul>',
          },
          'el-menu-item': {
            template:
              '<li class="el-menu-item" :class="$attrs.class" @click="$emit(\'click\')"><slot /></li>',
          },
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-empty': {
            template: '<div class="el-empty">No data</div>',
            props: ['imageSize'],
          },
        },
      },
    })

    expect(wrapper.find('.tag-title').text()).toBe('Tags')
    expect(wrapper.findAll('.el-menu-item')).toHaveLength(3)
  })

  it('renders empty state when no tags provided', () => {
    const wrapper = mount(TagSidebar, {
      props: {
        tags: [],
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-menu': {
            template: '<ul class="el-menu"><slot /></ul>',
          },
          'el-menu-item': {
            template: '<li class="el-menu-item" @click="$emit(\'click\')"><slot /></li>',
          },
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-empty': {
            template: '<div class="el-empty">No data</div>',
            props: ['imageSize'],
          },
        },
      },
    })

    expect(wrapper.find('.el-empty').exists()).toBe(true)
    expect(wrapper.findAll('.el-menu-item')).toHaveLength(0)
  })

  it('renders tag names and post counts correctly', () => {
    const wrapper = mount(TagSidebar, {
      props: {
        tags: mockTags,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-menu': {
            template: '<ul class="el-menu"><slot /></ul>',
          },
          'el-menu-item': {
            template: '<li class="el-menu-item" @click="$emit(\'click\')"><slot /></li>',
          },
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-empty': {
            template: '<div class="el-empty">No data</div>',
            props: ['imageSize'],
          },
        },
      },
    })

    const tagNames = wrapper.findAll('.tag-name')
    const tagCounts = wrapper.findAll('.el-tag')

    expect(tagNames[0].text()).toBe('Vue')
    expect(tagNames[1].text()).toBe('TypeScript')
    expect(tagNames[2].text()).toBe('Testing')

    expect(tagCounts[0].text()).toBe('10')
    expect(tagCounts[1].text()).toBe('8')
    expect(tagCounts[2].text()).toBe('5')
  })

  it('highlights active tag', () => {
    const wrapper = mount(TagSidebar, {
      props: {
        tags: mockTags,
        activeTag: 'Vue',
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-menu': {
            template: '<ul class="el-menu"><slot /></ul>',
          },
          'el-menu-item': {
            template:
              '<li class="el-menu-item" :class="$attrs.class" @click="$emit(\'click\')"><slot /></li>',
          },
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-empty': {
            template: '<div class="el-empty">No data</div>',
            props: ['imageSize'],
          },
        },
      },
    })

    const menuItems = wrapper.findAll('.el-menu-item')
    expect(menuItems[0].classes()).toContain('active-tag')
    expect(menuItems[1].classes()).not.toContain('active-tag')
    expect(menuItems[2].classes()).not.toContain('active-tag')
  })

  it('emits tagClick event when tag is clicked', async () => {
    const wrapper = mount(TagSidebar, {
      props: {
        tags: mockTags,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-menu': {
            template: '<ul class="el-menu"><slot /></ul>',
          },
          'el-menu-item': {
            template: '<li class="el-menu-item" @click="$emit(\'click\')"><slot /></li>',
          },
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-empty': {
            template: '<div class="el-empty">No data</div>',
            props: ['imageSize'],
          },
        },
      },
    })

    const firstMenuItem = wrapper.findAll('.el-menu-item')[0]
    await firstMenuItem.trigger('click')

    expect(wrapper.emitted('tagClick')).toBeTruthy()
    expect(wrapper.emitted('tagClick')?.[0]).toEqual(['Vue'])
  })

  it('handles undefined tags prop gracefully', () => {
    const wrapper = mount(TagSidebar, {
      props: {},
      global: {
        plugins: [ElementPlus],
        stubs: {
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-menu': {
            template: '<ul class="el-menu"><slot /></ul>',
          },
          'el-menu-item': {
            template: '<li class="el-menu-item" @click="$emit(\'click\')"><slot /></li>',
          },
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-empty': {
            template: '<div class="el-empty">No data</div>',
            props: ['imageSize'],
          },
        },
      },
    })

    expect(wrapper.find('.el-empty').exists()).toBe(true)
    expect(wrapper.findAll('.el-menu-item')).toHaveLength(0)
  })
})
