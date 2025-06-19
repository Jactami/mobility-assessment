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

  <BaseSection title="Menu">
    <p>
      The menu is a component that can be used to display a list of items. It is defined in the
      <code>src/components/menu/*.vue</code> files.
    </p>
    <div class="mt-10 flex flex-col items-center space-y-5">
      <MenuPanel :menu="menu" />
      <MenuPopup :menu="menu" />
    </div>
  </BaseSection>

  <BaseSection title="Data Table">
    <p>
      The data table is a component that can be used to display a list of generic items. It is
      defined in the <code>src/components/table/DataTable.vue</code> file.
    </p>
    <div class="mt-10">
      <DataTable :config="tableConfig" :data="data">
        <template #item-status="{ value }">
          <span class="font-semibold">{{ value }}</span>
        </template>
      </DataTable>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import BaseSection from '@/components/base/BaseSection.vue'
import DebugPanel from '@/components/debug/DebugPanel.vue'
import MenuPanel from '@/components/menu/MenuPanel.vue'
import MenuPopup from '@/components/menu/MenuPopup.vue'
import type { Menu } from '@/components/menu/types'
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import { useLogger } from '@/composables/log'
import { useNotification } from '@/composables/notification'
import MaterialSymbolsLogin from '~icons/material-symbols/login'

const logger = useLogger('playground')
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

const menu: Menu = [
  {
    label: 'Link',
    icon: 'link',
    link: '/',
  },
  {
    label: 'Action',
    icon: 'link',
    action: () => logger.log('Test action'),
    divider: true,
  },
  {
    label: 'Disabled',
    icon: 'link',
    disabled: true,
  },
]

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const tableConfig: TableConfig<Person> = {
  columns: [
    {
      key: 'firstName',
      label: 'First Name',
      sortable: true,
    },
    {
      key: 'lastName',
      label: 'Last Name',
      sortable: true,
    },
    {
      key: 'age',
      label: 'Age',
      sortable: true,
    },
    {
      key: 'visits',
      label: 'Visits',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'progress',
      label: 'Progress',
      sortable: true,
      formatter: (value) => `${value}%`,
    },
  ],
  searchable: true,
  pagination: true,
  presort: {
    key: 'firstName',
    order: 'asc',
  },
}

const data: Person[] = [
  {
    firstName: 'Tanner',
    lastName: 'Linsley',
    age: 24,
    visits: 100,
    status: 'Relationship',
    progress: 50,
  },
  {
    firstName: 'Tandy',
    lastName: 'Miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'Joe',
    lastName: 'Dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]
</script>
