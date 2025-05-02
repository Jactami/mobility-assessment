import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    devOnly?: boolean
  }
}

export {}
