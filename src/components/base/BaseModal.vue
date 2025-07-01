<template>
  <Dialog :open="isOpen" @close="isOpen = false" class="relative z-50">
    <!-- The backdrop, rendered as a fixed sibling to the panel container -->
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />

    <!-- Full-screen container to center the panel -->
    <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
      <!-- The actual dialog panel -->
      <DialogPanel class="relative w-full max-w-5xl rounded-border bg-surface p-6 shadow-md">
        <div class="absolute top-4 right-4">
          <IconButton icon="close" @click="isOpen = false" />
        </div>
        <DialogTitle v-if="title" class="mb-4 text-xl font-bold">{{ title }}</DialogTitle>
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
import IconButton from '@/components/icon/IconButton.vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

defineProps<{
  title?: string
}>()

const isOpen = defineModel<boolean>()
</script>
