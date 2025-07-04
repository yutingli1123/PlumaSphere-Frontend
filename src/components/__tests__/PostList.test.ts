import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostList from '../PostList.vue'
import PostContent from '../PostContent.vue'
import type { Article } from '@/types'
import ElementPlus from 'element-plus'

describe('PostList', () => {
  const mockArticles: Article[] = [
    {
      id: 1,
      title: 'First Article',
      description: 'First article description',
      content: 'Content 1',
      authorId: 1,
      tags: ['Vue', 'TypeScript'],
      createdAt: '2025-06-29T10:00:00Z',
      updatedAt: '2025-06-29T10:00:00Z',
    },
    {
      id: 2,
      title: 'Second Article',
      description: 'Second article description',
      content: 'Content 2',
      authorId: 2,
      tags: ['React', 'JavaScript'],
      createdAt: '2025-06-29T11:00:00Z',
      updatedAt: '2025-06-29T11:00:00Z',
    },
  ]

  let defaultProps: { articles: Article[]; refresh: () => void }

  beforeEach(() => {
    defaultProps = {
      articles: mockArticles,
      refresh: vi.fn(),
    }
  })

  it('renders articles when provided', () => {
    const wrapper = mount(PostList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: true,
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
        },
      },
    })

    const articleCards = wrapper.findAll('.article-card')
    expect(articleCards).toHaveLength(2)
  })

  it('renders PostContent components for each article', () => {
    const wrapper = mount(PostList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: PostContent,
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
        },
      },
    })

    const postContentComponents = wrapper.findAllComponents(PostContent)
    expect(postContentComponents).toHaveLength(2)
    expect(postContentComponents[0].props('article')).toEqual(mockArticles[0])
    expect(postContentComponents[1].props('article')).toEqual(mockArticles[1])
  })

  it('shows empty state when no articles provided', () => {
    const wrapper = mount(PostList, {
      props: {
        articles: [],
        refresh: vi.fn(),
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: true,
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-empty': {
            template: '<div class="el-empty"><slot name="description" /><slot /></div>',
            props: ['imageSize'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type'],
          },
        },
      },
    })

    expect(wrapper.find('.el-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('No Article')
  })

  it('shows empty state when articles is undefined', () => {
    const wrapper = mount(PostList, {
      props: {
        articles: undefined,
        refresh: vi.fn(),
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: true,
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-empty': {
            template: '<div class="el-empty"><slot name="description" /><slot /></div>',
            props: ['imageSize'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type'],
          },
        },
      },
    })

    expect(wrapper.find('.el-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('No Article')
  })

  it('calls refresh function when refresh button is clicked', async () => {
    const refreshMock = vi.fn()
    const wrapper = mount(PostList, {
      props: {
        articles: [],
        refresh: refreshMock,
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: true,
          'router-link': {
            template: '<a><slot /></a>',
          },
        },
      },
    })

    const refreshButton = wrapper.find('.el-button')
    await refreshButton.trigger('click')

    expect(refreshMock).toHaveBeenCalledTimes(1)
  })

  it('has correct CSS classes for styling', () => {
    const wrapper = mount(PostList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: true,
          'el-card': {
            template: '<div class="el-card article-card"><slot /></div>',
          },
        },
      },
    })

    const articleCards = wrapper.findAll('.article-card')
    expect(articleCards).toHaveLength(2)
    articleCards.forEach((card) => {
      expect(card.classes()).toContain('article-card')
    })
  })

  it('has minimum height style applied', () => {
    const wrapper = mount(PostList, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: true,
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
        },
      },
    })

    const container = wrapper.find('div[style*="min-height"]')
    expect(container.exists()).toBe(true)
    expect(container.attributes('style')).toContain('min-height: 80dvh')
  })

  it('renders refresh button with correct type in empty state', () => {
    const wrapper = mount(PostList, {
      props: {
        articles: [],
        refresh: vi.fn(),
      },
      global: {
        plugins: [ElementPlus],
        stubs: {
          PostContent: true,
          'el-card': {
            template: '<div class="el-card"><slot /></div>',
          },
          'el-empty': {
            template: '<div class="el-empty"><slot name="description" /><slot /></div>',
            props: ['imageSize'],
          },
          'el-button': {
            template: '<button :type="type" @click="$emit(\'click\')"><slot /></button>',
            props: ['type'],
          },
        },
      },
    })

    const refreshButton = wrapper.find('button')
    expect(refreshButton.exists()).toBe(true)
    expect(refreshButton.text()).toBe('Refresh')
  })
})
