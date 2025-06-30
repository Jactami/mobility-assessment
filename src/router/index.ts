import i18n from '@/i18n'
import { useAuthStore } from '@/stores/Auth'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import options from './options'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      roles: ['user'],
    },
  },
  {
    path: '/playground',
    name: 'playground',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/PlaygroundView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/SignInView.vue'),
  },
  {
    path: '/project/:projectId',
    name: 'project',
    component: () => import('../views/ProjectView.vue'),
    meta: {
      roles: ['user'],
    },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: {
      roles: ['admin', 'user'],
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: {
      roles: ['admin'],
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: import.meta.env.DEV ? routes : routes.filter((route) => !route.meta?.devOnly),
  scrollBehavior: options.scrollBehavior,
})

// handle navigation with authentication
router.beforeEach(async (to, _, next) => {
  // Allow navigation to public routes
  if (!to.meta.roles) return next()

  // Wait for authentication
  const authStore = useAuthStore()
  await authStore.authInitialized

  if (authStore.user && authStore.role) {
    if (to.meta.roles.includes(authStore.role)) {
      // Allow navigation, if user is authenticated and has the required role
      return next()
    } else {
      // Redirect to home or admin, if user is authenticated but does not have the required role
      return next(authStore.role === 'admin' ? '/admin' : '/')
    }
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
