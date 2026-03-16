<template>
  <UIPageHeader
    :title="t('navigation.playground')"
    subtitle="A place to develop and test new components and features."
  />

  <UISection title="Color Palette">
    <p>
      The color palette is based on the Material Design 3 guidelines. The colors are defined in the
      <code>assets/main.css</code>file and can be used throughout the application.
    </p>
    <div class="font-medium">
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

      <div
        class="mt-10 flex flex-col items-center justify-center gap-6 text-center sm:flex-row [&>div>div]:flex [&>div>div]:size-24 [&>div>div]:items-center [&>div>div]:justify-center"
      >
        <div>
          <div class="bg-success text-on-success">Success</div>
          <div class="bg-success-container text-on-success-container">Success Container</div>
        </div>
        <div>
          <div class="bg-error text-on-error">Error</div>
          <div class="bg-error-container text-on-error-container">Error Container</div>
        </div>
      </div>
    </div>
  </UISection>

  <UISection title="Buttons">
    <p>
      The buttons can be configured with different colors, sizes, and states. The buttons are
      defined in the <code>src/components/ui/UIButton.vue</code> file and can be used throughout the
      application.
    </p>
    <div
      class="mt-10 space-y-8 [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:justify-center [&>div]:gap-6 [&>div]:sm:flex-row"
    >
      <div>
        <UIButton variant="solid" severity="primary">Primary Solid</UIButton>
        <UIButton variant="solid" severity="neutral">Neutral Solid</UIButton>
        <UIButton variant="solid" severity="success">Success Solid</UIButton>
        <UIButton variant="solid" severity="danger">Danger Solid</UIButton>
        <UIButton variant="solid" severity="warning">Warning Solid</UIButton>
      </div>
      <div>
        <UIButton variant="ghost" severity="primary">Primary Ghost</UIButton>
        <UIButton variant="ghost" severity="neutral">Neutral Ghost</UIButton>
        <UIButton variant="ghost" severity="success">Success Ghost</UIButton>
        <UIButton variant="ghost" severity="danger">Danger Ghost</UIButton>
        <UIButton variant="ghost" severity="warning">Warning Ghost</UIButton>
      </div>
      <div>
        <UIButton size="sm">Small Button</UIButton>
        <UIButton size="md">Medium Button</UIButton>
        <UIButton size="lg">Large Button</UIButton>
      </div>
      <div>
        <UIButton icon="signIn">Button with Icon</UIButton>
      </div>
      <div>
        <UIButton disabled>Disabled Solid</UIButton>
        <UIButton variant="ghost" severity="primary" disabled>Disabled Ghost</UIButton>
      </div>
      <div>
        <UIButton
          severity="none"
          class="w-full max-w-96 rounded-full bg-lime-700 text-white focus:ring-lime-700 enabled:hover:bg-lime-700/90 enabled:active:bg-lime-700/80"
        >
          Custom Button <UIIcon icon="signIn" />
        </UIButton>
      </div>
      <div>
        <UIButtonIcon severity="primary" icon="add" title="Icon Button" />
        <UIButtonIcon severity="neutral" icon="add" title="Icon Button" />
        <UIButtonIcon severity="success" icon="add" title="Icon Button" />
        <UIButtonIcon severity="danger" icon="add" title="Icon Button" />
        <UIButtonIcon severity="warning" icon="add" title="Icon Button" />
        <UIButtonIcon severity="neutral" icon="add" title="Icon Button" disabled />
      </div>
    </div>
  </UISection>

  <UISection title="Badges">
    <p>
      The badges are defined in the <code>src/components/ui/UIBadge.vue</code> file and can be used
      throughout the application to display small pieces of information.
    </p>
    <div class="mt-10 flex items-center justify-center gap-6">
      <UIBadge severity="primary" label="Primary" />
      <UIBadge severity="neutral" label="Neutral" />
      <UIBadge severity="success" label="Success" />
      <UIBadge severity="warning" label="Warning" />
      <UIBadge severity="danger" label="Danger" />
    </div>
  </UISection>

  <UISection title="Icons">
    <p>
      This is an overview of the available icons. The icons are defined in the
      <code>src/components/ui/icon/UIIcon.vue</code> file.
    </p>
    <div class="mt-10 grid grid-cols-4 gap-x-8 gap-y-10 lg:grid-cols-12">
      <div v-for="icon of Object.keys(icons)" :key="icon" class="flex flex-col items-center gap-2">
        <UIIcon :icon="icon as Icon" />
        <div class="text-sm text-on-surface-variant">{{ icon }}</div>
      </div>
    </div>
  </UISection>

  <UISection title="Debug Panel">
    <p>
      The debug panel is a component that can be used to display the current state of variables. It
      is defined in the <code>src/components/debug/DebugPanel.vue</code> file.
    </p>
    <DebugPanel title="Quiz Data" :value="quiz" class="mt-10" />
  </UISection>

  <UISection title="FormKit Integration">
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
  </UISection>

  <UISection title="Notifications">
    <p>The notifications are based on the SweetAlert2 library.</p>
    <div class="mt-10 flex items-center justify-center gap-6">
      <UIButton severity="neutral" @click="notification.successToast('Success message...')">
        Success
      </UIButton>
      <UIButton severity="neutral" @click="notification.errorToast('Error message...')">
        Error
      </UIButton>
    </div>
  </UISection>

  <UISection title="Alerts">
    <p>
      The alerts are defined in the <code>src/components/ui/UIAlert.vue</code> file and can be used
      throughout the application to display important messages.
    </p>
    <div class="mt-10 space-y-6">
      <UIAlert
        severity="primary"
        title="Primary Alert"
        message="This is a primary alert message."
      />
      <UIAlert
        severity="neutral"
        title="Neutral Alert"
        message="This is a neutral alert message."
      />
      <UIAlert
        severity="success"
        title="Success Alert"
        message="This is a success alert message."
      />
      <UIAlert
        severity="warning"
        title="Warning Alert"
        message="This is a warning alert message."
      />
      <UIAlert severity="danger" title="Danger Alert" message="This is a danger alert message." />
      <UIAlert severity="primary" title="Custom Alert">
        <template #default="{ severity }">
          <p>
            This is a custom alert message. You can use the <code>slot</code> to define your own
            message content and add arbitrary components. For example, you can add a button to the
            alert like this:
          </p>
          <UIButton :severity="severity" class="mt-4">Alert Button</UIButton>
        </template>
      </UIAlert>
    </div>
  </UISection>

  <UISection title="Menu">
    <p>
      The menu is a component that can be used to display a list of items. It is defined in the
      <code>src/components/menu/UIMenu.vue</code> file.
    </p>
    <div class="mt-10 text-center">
      <UIMenu :items="menu" position="bottom-start" />
    </div>
  </UISection>

  <UISection title="Tooltip">
    <p>
      The tooltip is a component that can be used to display additional information. It is defined
      in the <code>src/components/ui/UITooltip.vue</code> file.
    </p>
    <div class="mt-10 flex items-center justify-evenly gap-10">
      <UITooltip message="This is a tooltip message that appears on hover.">
        <div class="bg-primary-container p-4 text-lg font-semibold text-on-primary-container">
          Hover me
        </div>
      </UITooltip>
      <UITooltip
        message="You can also define the position of the tooltip. This one is on the bottom."
        position="bottom"
      >
        <div class="bg-primary-container p-4 text-lg font-semibold text-on-primary-container">
          Hover me
        </div>
      </UITooltip>
    </div>
    <div></div>
  </UISection>

  <UISection title="Data Table">
    <p>
      The data table is a component that can be used to display a list of generic items. It is
      defined in the <code>src/components/table/DataTable.vue</code> file.
    </p>
    <div class="mt-10">
      <DataTable :config="tableConfig" :data="data">
        <template #column-status="{ value }">
          <span class="font-semibold">{{ value }}</span>
        </template>
      </DataTable>
    </div>
  </UISection>

  <UISection title="Modal">
    <p>
      The modal is a component that can be used to display a dialog. It is defined in the
      <code>src/components/base/UIModal.vue</code> file.
    </p>
    <div class="mt-4 flex justify-center">
      <UIButton @click="modalOpen = true">Open Modal</UIButton>
    </div>
    <UIModal v-model="modalOpen" title="My Modal">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum rem, ex assumenda, eligendi
      voluptate provident sint non doloremque perferendis accusamus, unde quisquam ullam? Tempore
      delectus ipsum voluptatem temporibus velit laboriosam.
    </UIModal>
  </UISection>

  <UISection title="Mark Directive">
    <p>
      The mark directive is a custom directive that can be used to highlight text. It is defined in
      the <code>src/directives/mark/index.ts</code> file.
    </p>
    <div class="mt-10">
      <div class="max-w-sm">
        <FormKit v-model="search" name="highlight_search" label="Search" />
      </div>
      <div v-mark="search">
        <p>
          It is only with the heart that one can see rightly; what is essential is invisible to the
          eye.
        </p>
        <p>
          Grown-ups like numbers. When you tell them about a new friend, they never ask questions
          about what really matters.
        </p>
      </div>
    </div>
  </UISection>
</template>

<script setup lang="ts">
import DebugPanel from '@/components/debug/DebugPanel.vue'
import DataTable from '@/components/table/DataTable.vue'
import type TableConfig from '@/components/table/types'
import UIButton from '@/components/ui/button/UIButton.vue'
import UIButtonIcon from '@/components/ui/button/UIButtonIcon.vue'
import type { Icon } from '@/components/ui/icon/types'
import { icons } from '@/components/ui/icon/types'
import UIIcon from '@/components/ui/icon/UIIcon.vue'
import type { MenuListItem } from '@/components/ui/menu/types'
import UIMenu from '@/components/ui/menu/UIMenu.vue'
import UIAlert from '@/components/ui/UIAlert.vue'
import UIBadge from '@/components/ui/UIBadge.vue'
import UIModal from '@/components/ui/UIModal.vue'
import UIPageHeader from '@/components/ui/UIPageHeader.vue'
import UISection from '@/components/ui/UISection.vue'
import UITooltip from '@/components/ui/UITooltip.vue'
import { useLogger } from '@/composables/log'
import { useNotification } from '@/composables/notification'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const logger = useLogger()
const notification = useNotification()

logger.log('Logger running...')

const modalOpen = ref(false)

const search = ref('')

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

const menu: MenuListItem[] = [
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
      sort: 'raw',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      sort: 'raw',
    },
    {
      key: 'age',
      label: 'Age',
      sort: 'raw',
    },
    {
      key: 'visits',
      label: 'Visits',
      sort: 'raw',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'progress',
      label: 'Progress',
      sort: 'raw',
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
