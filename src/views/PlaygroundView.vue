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
      class="mt-10 flex flex-col items-center justify-center gap-6 text-center sm:flex-row [&>div>div]:flex [&>div>div]:size-24 [&>div>div]:items-center [&>div>div]:justify-center"
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
      class="mt-10 flex flex-col items-center justify-center gap-6 text-center sm:flex-row [&>div]:flex [&>div]:size-24 [&>div]:items-center [&>div]:justify-center"
    >
      <div class="bg-surface-container-lowest text-on-surface">Container lowest</div>
      <div class="bg-surface-container-low text-on-surface">Container low</div>
      <div class="bg-surface-container text-on-surface">Container</div>
      <div class="bg-surface-container-high text-on-surface">Container high</div>
      <div class="bg-surface-container-highest text-on-surface">Container highest</div>
    </div>
  </BaseSection>

  <BaseSection title="Buttons">
    <p>
      The buttons can be configur ed with different colors, sizes, and states. The buttons are
      defined in the <code>src/components/base/BaseButton.vue</code> file and can be used throughout
      the application.
    </p>
    <div
      class="mt-10 space-y-8 [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:justify-center [&>div]:gap-6 [&>div]:sm:flex-row"
    >
      <div>
        <BaseButton>Primary Button</BaseButton>
        <BaseButton flavor="secondary">Secondary Button</BaseButton>
        <BaseButton flavor="tertiary">Tertiary Button</BaseButton>
      </div>
      <div>
        <BaseButton size="small">Small Button</BaseButton>
        <BaseButton>Normal Button</BaseButton>
        <BaseButton size="large">Large Button</BaseButton>
      </div>
      <div>
        <BaseButton disabled>Disabled Button</BaseButton>
      </div>
      <div>
        <BaseButton flavor="custom" classes="bg-lime-700 text-white w-full max-w-96 rounded-full">
          Custom Button <MaterialSymbolsLogin />
        </BaseButton>
      </div>
    </div>
  </BaseSection>

  <BaseSection title="Debug Panel">
    <p>
      The debug panel is a component that can be used to display the current state of variables. It
      is defined in the <code>src/components/debug/DebugPanel.vue</code> file.
    </p>
    <DebugPanel title="Quiz Data" :value="quiz" class="mt-10" />
  </BaseSection>

  <BaseSection title="FormKit Integration">
    <FormKit type="form" @submit="(data) => logger.log('formkit data', data)">
      <FormKit
        type="text"
        name="name"
        id="name"
        validation="required|not:Admin"
        label="Name"
        help="Enter your character's full name"
        placeholder="“Scarlet Sword”"
      />
      <FormKit
        type="select"
        label="Class"
        name="class"
        id="class"
        placeholder="Select a class"
        :options="['Warrior', 'Mage', 'Assassin']"
      />
      <FormKit
        type="range"
        name="strength"
        id="strength"
        label="Strength"
        value="5"
        validation="min:2|max:9"
        validation-visibility="live"
        min="1"
        max="10"
        step="1"
        help="How many strength points should this character have?"
      />
      <FormKit
        type="range"
        name="skill"
        id="skill"
        validation="required|max:10"
        label="Skill"
        value="5"
        min="1"
        max="10"
        step="1"
        help="How many skill points should this character have?"
      />
      <FormKit
        type="range"
        name="dexterity"
        id="dexterity"
        validation="required|max:10"
        label="Dexterity"
        value="5"
        min="1"
        max="10"
        step="1"
        help="How many dexterity points should this character have?"
      />
    </FormKit>
  </BaseSection>

  <BaseSection title="Notifications">
    <p>The notifications are based on the SweetAlert2 library.</p>
    <div class="mt-10 flex items-center justify-center gap-6">
      <BaseButton
        flavor="custom"
        classes="bg-success text-on-success"
        @click="notification.successToast('Success message...')"
      >
        Success
      </BaseButton>
      <BaseButton
        flavor="custom"
        classes="bg-error text-on-error"
        @click="notification.errorToast('Error message...')"
      >
        Error
      </BaseButton>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseSection from '@/components/base/BaseSection.vue'
import { useLogger } from '@/composables/log'
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import MaterialSymbolsLogin from '~icons/material-symbols/login'
import DebugPanel from '@/components/debug/DebugPanel.vue'
import { useNotification } from '@/composables/notification'

const logger = useLogger()
const notification = useNotification()

logger.log('Logger running...')

const quiz = {
  sport: {
    q1: {
      question: 'Which one is correct team name in NBA?',
      options: ['New York Bulls', 'Los Angeles Kings', 'Golden State Warriros', 'Huston Rocket'],
      answer: 'Huston Rocket',
    },
  },
  maths: {
    q1: {
      question: '5 + 7 = ?',
      options: [10, 11, 12, 13],
      answer: 12,
    },
  },
}
</script>
