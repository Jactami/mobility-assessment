import i18n from '@/i18n'
import { useAuthStore } from '@/stores/Auth'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      public: true,
      devOnly: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/SignInView.vue'),
    meta: {
      public: true,
    },
  },
  {
    path: '/project/:projectId',
    name: 'project',
    component: () => import('../views/ProjectView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: import.meta.env.DEV ? routes : routes.filter((route) => !route.meta?.devOnly),
})

// handle navigation with authentication
router.beforeEach(async (to, _, next) => {
  // Allow navigation to public routes
  if (to.meta.public) return next()

  // Wait for authentication
  const authStore = useAuthStore()
  await authStore.authInitialized

  if (authStore.user) {
    // Allow user navigation, if user is authenticated
    return next()
  } else {
    // Redirect to login, if user not authenticated
    return next(`/login?redirect=${to.path}`)
  }
})

// set document title
router.beforeEach((to) => {
  const title = i18n.global.t('meta.title')
  const subtitle = i18n.global.t(`meta.${to.name?.toString()}`)

  document.title = subtitle ? `${title} | ${subtitle}` : title
})

export default router
