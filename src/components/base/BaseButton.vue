<template>
  <button
    :type="type"
    :title="title"
    :class="
      twMerge([
        'relative inline-flex cursor-pointer items-center justify-center gap-x-2 rounded-md shadow-sm hover:shadow-md hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:brightness-100',
        colorClasses,
        sizeClasses,
        classes,
      ])
    "
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

interface Props {
  type?: 'button' | 'submit' | 'reset'
  title?: string
  flavor?: 'primary' | 'secondary' | 'tertiary' | 'custom'
  size?: 'small' | 'normal' | 'large'
  disabled?: boolean
  classes?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  flavor: 'primary',
  size: 'normal',
  disabled: false,
  classes: '',
})

const flavorMap: Record<Exclude<Props['flavor'], undefined>, string> = {
  primary: 'bg-primary text-on-primary focus:outline-primary',
  secondary: 'bg-secondary text-on-secondary focus-visible:outline-secondary',
  tertiary: 'bg-tertiary text-on-tertiary focus-visible:outline-tertiary',
  custom: '',
}

const colorClasses = computed(() => flavorMap[props.flavor])

const sizeMap: Record<Exclude<Props['size'], undefined>, string> = {
  small: 'text-sm px-2.5 py-1.5',
  normal: 'text-base px-3.5 py-2.5',
  large: 'text-lg px-4 py-3',
}
const sizeClasses = computed(() => sizeMap[props.size])
</script>
