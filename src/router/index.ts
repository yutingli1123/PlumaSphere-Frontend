import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import SetupView from '@/views/SetupView.vue'
import CreatePostView from '@/views/CreatePostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/posts/:postId',
      name: 'post',
      component: PostView,
      props: true,
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupView,
    },
    {
      path: '/create-post',
      name: 'create-post',
      component: CreatePostView,
    },
  ],
  scrollBehavior: (to, from, savedPosition) => {
    if (to.path === '/' && from.path.startsWith('/posts/')) {
      return savedPosition ?? { top: 0 }
    }
    return { top: 0 }
  },
})

export default router
