<template>
  <UIButtonBase
    :type="type"
    :title="title"
    :disabled="disabled"
    :tooltip="tooltip"
    :class="btnClass"
  >
    <UIIcon :icon="icon" />
  </UIButtonBase>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { computed } from 'vue'
import type { Icon } from '../icon/types'
import UIIcon from '../icon/UIIcon.vue'
import UIButtonBase from './elements/UIButtonBase.vue'
import type { ButtonProps } from './types'

type Props = ButtonProps & {
  icon: Icon
  class?: string // additional (tailwind) classes
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const btnClass = computed(() =>
  twMerge(
    'aspect-square cursor-pointer rounded-full p-1.5 shadow-none hover:bg-surface-container-highest hover:shadow-none hover:brightness-100 disabled:cursor-not-allowed disabled:bg-transparent disabled:shadow-none',
    props.class,
  ),
)
</script>
