<template>
  <BasePageHeader :title="t('auth.profile')" />
  <BaseSection>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse at maxime nihil? Nihil, incidunt
      libero iste blanditiis repudiandae nulla, cumque tempore quae, assumenda sequi deleniti
      recusandae unde quo. Et, voluptatem.
    </p>
  </BaseSection>
  <BaseSection :title="t('auth.resetPassword')">
    <p>Lorem ipsum</p>
  </BaseSection>
</template>

<script setup lang="ts">
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
