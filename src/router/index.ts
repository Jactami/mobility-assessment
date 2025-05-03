import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import i18n from '@/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/playground',
    name: 'playground',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/PlaygroundView.vue'),
    meta: {
      devOnly: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: import.meta.env.DEV ? routes : routes.filter((route) => !route.meta?.devOnly),
})

// set document title
router.beforeEach((to) => {
  const title = i18n.global.t('meta.title')
  const subtitle = i18n.global.t(`meta.${to.name?.toString()}`)

  document.title = subtitle ? `${title} | ${subtitle}` : title
})

export default router
