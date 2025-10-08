<template>
  <Dialog :open="isOpen" @close="isOpen = false" class="relative z-50">
    <!-- The backdrop, rendered as a fixed sibling to the panel container -->
    <div class="fixed inset-0 bg-black opacity-70" aria-hidden="true" />

    <!-- Full-screen container to center the panel -->
    <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
      <!-- The actual dialog panel -->
      <DialogPanel
        class="rounded-border border-outline-variant bg-surface-container-lowest relative w-full max-w-2xl border p-6 shadow-md"
      >
        <div class="z-9999 absolute right-4 top-4">
          <UIButtonIcon icon="close" @click="isOpen = false" />
        </div>
        <DialogTitle v-if="title" class="mb-6 text-xl font-bold">{{ title }}</DialogTitle>
        <div>
          <slot>
            <!-- Modal content goes here. -->
          </slot>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import UIButtonIcon from './button/UIButtonIcon.vue'

defineProps<{
  title?: string
}>()

const isOpen = defineModel<boolean>()
</script>
