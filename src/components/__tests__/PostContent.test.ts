import { describe, it, expect } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import PostContent from '../PostContent.vue'
import type { Article } from '@/types'
import { DateTime } from 'luxon'
import ElementPlus from 'element-plus'

describe('PostContent', () => {
  const mockArticle: Article = {
    id: 1,
    title: 'Test Article Title',
    description: 'This is a test article description',
    content: 'This is the full content',
    authorId: 1,
    tags: ['Vue', 'TypeScript', 'Testing'],
    createdAt: '2025-06-29T10:00:00Z',
    updatedAt: '2025-06-29T10:00:00Z',
  }

  it('renders article content correctly', () => {
    const wrapper = mount(PostContent, {
      props: {
        article: mockArticle,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          IEpCalendar: true,
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-icon': {
            template: '<i><slot /></i>',
          },
        },
      },
    })

    expect(wrapper.find('.article-title').text()).toBe('Test Article Title')
    expect(wrapper.find('.article-description').text()).toBe('This is a test article description')
  })

  it('renders article tags correctly', () => {
    const wrapper = mount(PostContent, {
      props: {
        article: mockArticle,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          IEpCalendar: true,
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-icon': {
            template: '<i><slot /></i>',
          },
        },
      },
    })

    const tags = wrapper.findAll('.el-tag')
    expect(tags).toHaveLength(3)
    expect(tags[0].text()).toBe('Vue')
    expect(tags[1].text()).toBe('TypeScript')
    expect(tags[2].text()).toBe('Testing')
  })

  it('renders article date correctly', () => {
    const wrapper = mount(PostContent, {
      props: {
        article: mockArticle,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          IEpCalendar: true,
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-icon': {
            template: '<i><slot /></i>',
          },
        },
      },
    })

    const dateText = wrapper.find('.article-date span').text()
    const expectedDate = DateTime.fromISO(mockArticle.createdAt)
      .toLocal()
      .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)

    expect(dateText).toBe(expectedDate)
  })

  it('creates correct router link', () => {
    const wrapper = mount(PostContent, {
      props: {
        article: mockArticle,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          IEpCalendar: true,
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-icon': {
            template: '<i><slot /></i>',
          },
        },
      },
    })

    const routerLink = wrapper.findComponent(RouterLinkStub)
    expect(routerLink.props('to')).toBe('/posts/1')
  })

  it('renders with no tags', () => {
    const articleWithoutTags: Article = {
      ...mockArticle,
      tags: [],
    }

    const wrapper = mount(PostContent, {
      props: {
        article: articleWithoutTags,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          IEpCalendar: true,
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-icon': {
            template: '<i><slot /></i>',
          },
        },
      },
    })

    const tags = wrapper.findAll('.el-tag')
    expect(tags).toHaveLength(0)
  })

  it('applies correct CSS classes', () => {
    const wrapper = mount(PostContent, {
      props: {
        article: mockArticle,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          RouterLink: RouterLinkStub,
          IEpCalendar: true,
          'el-tag': {
            template: '<span class="el-tag"><slot /></span>',
            props: ['type', 'size'],
          },
          'el-icon': {
            template: '<i><slot /></i>',
          },
        },
      },
    })

    expect(wrapper.find('.article-content-part').exists()).toBe(true)
    expect(wrapper.find('.article-content').exists()).toBe(true)
    expect(wrapper.find('.article-title').exists()).toBe(true)
    expect(wrapper.find('.article-description').exists()).toBe(true)
    expect(wrapper.find('.article-meta').exists()).toBe(true)
    expect(wrapper.find('.article-tags').exists()).toBe(true)
    expect(wrapper.find('.article-date').exists()).toBe(true)
  })
})
