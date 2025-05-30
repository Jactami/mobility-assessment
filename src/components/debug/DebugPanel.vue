<template>
  <div class="divide-y divide-outline-variant rounded-border border border-outline-variant">
    <div class="flex items-center justify-between gap-x-3 px-4 py-2">
      <span class="font-semibold">{{ title }}</span>
      <button
        type="button"
        :title="isCopied ? 'Copied!' : 'Copy to clipboard'"
        class="cursor-pointer rounded-border border border-outline p-2 hover:bg-surface-container-low"
        @click="copyToClipboard"
      >
        <IconRenderer v-if="!isCopied" icon="copy" />
        <IconRenderer v-else icon="check" />
      </button>
    </div>
    <pre
      class="max-h-fit resize-y overflow-y-auto bg-surface-container-low px-4 py-3 text-sm/6 break-words whitespace-pre-wrap text-on-surface-variant"
      v-html="highlightedJson"
    ></pre>
  </div>
</template>

<script setup lang="ts">
import IconRenderer from '@/components/icon/IconRenderer.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  title?: string
  value: unknown
}>()

// https://stackoverflow.com/a/7220510
const highlightedJson = computed(() => {
  try {
    return JSON.stringify(props.value, null, 2).replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:\s*)?|true|false|null|\b\d+(\.\d+)?\b)/g,
      (match, _, __, p3) => {
        // Fallback color
        let cls = 'text-gray-600'
        if (p3) {
          // Keys
          cls = 'text-black'
        } else if (/^"/.test(match)) {
          // Strings
          cls = 'text-green-600'
        } else if (/true|false/.test(match)) {
          // Booleans
          cls = 'text-pink-600'
        } else if (/null/.test(match)) {
          // Null
          cls = 'text-gray-500'
        } else if (/\b\d+(\.\d+)?\b/.test(match)) {
          // Numbers
          cls = 'text-blue-600'
        }
        return `<span class="${cls}">${match}</span>`
      },
    )
  } catch {
    return props.value
  }
})

const isCopied = ref(false)

async function copyToClipboard() {
  const jsonString = JSON.stringify(props.value, null, 2)
  await navigator.clipboard.writeText(jsonString ? jsonString : (props.value as string))
  isCopied.value = true
  setTimeout(() => (isCopied.value = false), 2000)
}
</script>
