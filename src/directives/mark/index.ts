import Mark from 'mark.js'
import type { DirectiveBinding, ObjectDirective } from 'vue'
import type { MarkedHTMLElement } from './types'

/**
 * Vue directive to highlight text matching a given keyword.
 */
const markDirective: ObjectDirective = {
  // Initialize the directive on mount
  mounted(el: MarkedHTMLElement, binding: DirectiveBinding<string>) {
    const instance = new Mark(el)

    const highlight = (keyword: string) => {
      // Remove previous highlights
      instance.unmark({
        // When unmarking is done, apply new highlights
        done: () => {
          if (keyword && keyword.trim() !== '') {
            instance.mark(keyword, {
              separateWordSearch: false, // Highlight the whole phrase
              caseSensitive: false, // Case insensitive
            })
          }
        },
      })
    }

    // Initial highlight
    highlight(binding.value)

    // Store instance and highlight function for later use
    el.__markInstance__ = instance
    el.__highlightFn__ = highlight
  },

  // Update highlights when the bound value changes
  updated(el: MarkedHTMLElement, binding: DirectiveBinding<string>) {
    if (binding.value !== binding.oldValue) {
      el.__highlightFn__?.(binding.value)
    }
  },

  // Clean up when the directive is unbound
  unmounted(el: MarkedHTMLElement) {
    el.__markInstance__?.unmark()
    delete el.__markInstance__
    delete el.__highlightFn__
  },
}

export default markDirective
