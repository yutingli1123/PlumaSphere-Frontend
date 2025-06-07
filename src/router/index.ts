import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '@/views/PostView.vue'
import SetupView from '@/views/SetupView.vue'
import CreateOrEditPostView from '@/views/CreateOrEditPostView.vue'
import SearchView from '@/views/SearchView.vue'
import SettingView from '@/views/SettingView.vue'
import SystemSettingView from '@/views/settings/SystemSettingView.vue'
import PersonalSettingView from '@/views/settings/PersonalSettingView.vue'
import UserManagementView from '@/views/settings/UserManagementView.vue'

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
      component: CreateOrEditPostView,
    },
    {
      path: '/edit-post/:postId',
      name: 'edit-post',
      component: CreateOrEditPostView,
      props: true,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      props: (route) => ({ query: route.query.q, page: parseInt(route.query.page as string) || 1 }),
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingView,
      children: [
        {
          path: 'system',
          component: SystemSettingView,
        },
        {
          path: 'personal',
          component: PersonalSettingView,
        },
        {
          path: 'user-management',
          component: UserManagementView,
        },
      ],
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
