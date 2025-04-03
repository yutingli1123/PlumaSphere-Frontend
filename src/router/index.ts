import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleView from '@/views/ArticleView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/articles/:articleId',
      name: 'article',
      component: ArticleView,
      props: true,
    }
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (from.path == '/') {
      return {
        top: 0
      }
    }
    return savedPosition || { top: 0 }
  }
})

export default router
