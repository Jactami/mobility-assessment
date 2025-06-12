import type { RouterOptions } from 'vue-router'

/*
 * overwrite default routing to handle scroll behavior
 * https://nuxt.com/docs/guide/going-further/custom-routing#using-approuteroptions
 * https://stackoverflow.com/a/76681116
 */
export default <RouterOptions>{
  scrollBehavior(to, from, savedPosition) {
    // reload to previous position
    if (savedPosition) {
      return window.scrollTo(savedPosition)
    }

    // route with hash on same page
    if (to.hash && to.path === from.path) return scrollToElement(to.hash, true)

    // route with hash to new page
    if (to.hash && to.path !== from.path) {
      return scrollToElement(to.hash, false)
    }

    // route without hash to same page
    if (!to.hash && to.path === from.path) {
      return window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // route without hash to new page
    if (!to.hash && to.path !== from.path) {
      return window.scrollTo({ top: 0 })
    }
  },
}

// helper function to scroll to a specific HTML element
function scrollToElement(hash: string, smooth = false) {
  const element = document.querySelector(hash) as HTMLElement | null
  if (element) {
    let scrollMargin = 0
    // read elements scrollMargin if it has one in css
    const style = window.getComputedStyle(element)
    if (style.scrollMarginTop) scrollMargin = Number.parseInt(style.scrollMarginTop)
    window.scrollTo({ top: element.offsetTop - scrollMargin, behavior: smooth ? 'smooth' : 'auto' })
  }
}
