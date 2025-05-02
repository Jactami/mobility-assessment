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
    <div class="mt-10 flex flex-col items-center justify-center gap-6 text-center md:flex-row">
      <div>
        <div class="flex size-24 items-center justify-center bg-primary text-on-primary">
          Primary
        </div>
        <div
          class="flex size-24 items-center justify-center bg-primary-container text-on-primary-container"
        >
          Primary Container
        </div>
      </div>
      <div>
        <div class="flex size-24 items-center justify-center bg-secondary text-on-secondary">
          Secondary
        </div>
        <div
          class="flex size-24 items-center justify-center bg-secondary-container text-on-secondary-container"
        >
          Secondary Container
        </div>
      </div>
      <div>
        <div class="flex size-24 items-center justify-center bg-tertiary text-on-tertiary">
          Tertiary
        </div>
        <div
          class="flex size-24 items-center justify-center bg-tertiary-container text-on-tertiary-container"
        >
          Tertiary Container
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import { useLogger } from '@/composables/log'
import BasePageHeader from '@/components/base/BasePageHeader.vue'

useLogger().log('Logger running...')
</script>
