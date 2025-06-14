import type { UserRole } from '@/db/types'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: UserRole[]
    devOnly?: boolean
  }
}

export {}
