import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PageFooter from '../PageFooter.vue'

describe('PageFooter', () => {
  it('renders footer content correctly', () => {
    const wrapper = mount(PageFooter)

    expect(wrapper.find('.page-footer').exists()).toBe(true)
    expect(wrapper.find('.page-footer-content').text()).toBe(
      '© 2025 PlumaSphere. All rights reserved.',
    )
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(PageFooter)

    expect(wrapper.find('.page-footer').exists()).toBe(true)
    expect(wrapper.find('.page-footer-content').exists()).toBe(true)
  })

  it('renders as a div element', () => {
    const wrapper = mount(PageFooter)

    expect(wrapper.element.tagName).toBe('FOOTER')
    expect(wrapper.classes()).toContain('page-footer')
  })
})
