<template>
  <BasePageHeader
    title="Playground"
    subtitle="A place to develop and test new components and features."
  />

  <BaseSection title="Color Palette">
    <p>
      The color palette is based on the Material Design 3 guidelines. The colors are defined in the
      <code>assets/main.css</code>file and can be used throughout the application.
    </p>
    <div
      class="mt-10 flex flex-col items-center justify-center gap-6 text-center md:flex-row [&>div>div]:flex [&>div>div]:size-24 [&>div>div]:items-center [&>div>div]:justify-center"
    >
      <div>
        <div class="bg-primary text-on-primary">Primary</div>
        <div class="bg-primary-container text-on-primary-container">Primary Container</div>
      </div>
      <div>
        <div class="bg-secondary text-on-secondary">Secondary</div>
        <div class="bg-secondary-container text-on-secondary-container">Secondary Container</div>
      </div>
      <div>
        <div class="bg-tertiary text-on-tertiary">Tertiary</div>
        <div class="bg-tertiary-container text-on-tertiary-container">Tertiary Container</div>
      </div>
    </div>
    <div
      class="mt-10 flex flex-col items-center justify-center gap-6 text-center md:flex-row [&>div]:flex [&>div]:size-24 [&>div]:items-center [&>div]:justify-center"
    >
      <div class="bg-surface-container-lowest text-on-surface">Container lowest</div>
      <div class="bg-surface-container-low text-on-surface">Container low</div>
      <div class="bg-surface-container text-on-surface">Container</div>
      <div class="bg-surface-container-high text-on-surface">Container high</div>
      <div class="bg-surface-container-highest text-on-surface">Container highest</div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import { useLogger } from '@/composables/log'
import BasePageHeader from '@/components/base/BasePageHeader.vue'

useLogger().log('Logger running...')
</script>
