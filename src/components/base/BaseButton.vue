<template>
  <BasePopover v-if="title" :message="title">
    <button v-bind="$attrs" :type="type" :title="title" :class="buttonClasses" :disabled="disabled">
      <slot>
        <!-- Button content goes here. -->
      </slot>
    </button>
  </BasePopover>

  <button
    v-else
    v-bind="$attrs"
    :type="type"
    :title="title"
    :class="buttonClasses"
    :disabled="disabled"
  >
    <slot>
      <!-- Button content goes here. -->
    </slot>
  </button>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
import BasePopover from './BasePopover.vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  title?: string
  flavor?: 'primary' | 'secondary' | 'tertiary' | 'custom'
  size?: 'small' | 'normal' | 'large'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  flavor: 'primary',
  size: 'normal',
  disabled: false,
  class: '',
})

// Ensure that the component does not inherit classes from the parent at root level.
defineOptions({ inheritAttrs: false })

const flavorMap: Record<Exclude<Props['flavor'], undefined>, string> = {
  primary: 'bg-primary text-on-primary focus:outline-primary',
  secondary: 'bg-secondary text-on-secondary focus-visible:outline-secondary',
  tertiary: 'bg-tertiary text-on-tertiary focus-visible:outline-tertiary',
  custom: '',
}

const sizeMap: Record<Exclude<Props['size'], undefined>, string> = {
  small: 'text-sm px-2.5 py-1.5',
  normal: 'text-base px-3.5 py-2.5',
  large: 'text-lg px-4 py-3',
}

/**
 * Generated button classes based on the flavor and size props and passed classes.
 */
const buttonClasses = computed(() => {
  return twMerge([
    'relative inline-flex w-fit cursor-pointer items-center justify-center gap-x-2 rounded-border shadow-sm hover:shadow-md hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:brightness-100',
    flavorMap[props.flavor],
    sizeMap[props.size],
    props.class,
  ])
})
</script>
