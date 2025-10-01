<template>
  <Menu as="div" class="relative inline-block">
    <!-- Trigger -->
    <MenuButton ref="reference" @click.prevent>
      <slot name="trigger">
        <!-- Fallback trigger -->
        <UIButtonIcon icon="more" :aria-label="t('common.options')" />
      </slot>
    </MenuButton>

    <!-- Popup -->
    <Teleport to="body">
      <MenuItems
        ref="floating"
        class="rounded-border bg-surface text-on-surface ring-outline-variant z-50 min-w-56 max-w-md origin-top-right p-1 shadow-md ring focus:outline-none"
        :style="floatingStyles"
      >
        <!-- Menu Header -->
        <template v-if="$slots.start">
          <div class="p-2">
            <slot name="start">
              <!-- Content before the menu items goes here. -->
            </slot>
          </div>
          <hr class="border-outline-variant my-1" />
        </template>

        <!-- Menu Items -->
        <div>
          <template v-for="item in items" :key="item.label">
            <MenuItem v-slot="{ active }" :disabled="item.disabled">
              <component
                :is="item.link && !item.disabled ? 'RouterLink' : 'div'"
                :to="item.link"
                class="rounded-border flex w-full items-center gap-x-1.5 p-2"
                :class="[
                  {
                    'bg-surface-container cursor-pointer': active && !item.disabled,
                    'cursor-not-allowed opacity-50': item.disabled,
                  },
                ]"
                @click="handleAction(item)"
              >
                <UIIcon v-if="item.icon" :icon="item.icon" />
                <div class="flex-1">{{ item.label }}</div>
              </component>
            </MenuItem>
            <hr v-if="item.divider" class="border-outline-variant my-1" />
          </template>
        </div>

        <!-- Menu Footer -->
        <template v-if="$slots.end">
          <hr class="border-outline-variant my-1" />
          <div class="p-2">
            <slot name="end">
              <!-- Content after the menu items goes here. -->
            </slot>
          </div>
        </template>
      </MenuItems>
    </Teleport>
  </Menu>
</template>

<script setup lang="ts">
import { autoUpdate, flip, offset, useFloating, type Placement } from '@floating-ui/vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UIButtonIcon from '../button/UIButtonIcon.vue'
import UIIcon from '../icon/UIIcon.vue'
import type { MenuListItem } from './types'

interface Props {
  items: MenuListItem[]
  // Temporary fix for type issue with floating-ui Placement
  // TODO: remove '& string' when fixed
  position?: Placement & string
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-start',
})

const { t } = useI18n()

const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: props.position,
  middleware: [offset(5), flip()],
  whileElementsMounted: autoUpdate,
})

function handleAction(item: MenuListItem) {
  if (item.disabled) return
  if (!item.action) return

  item.action()
}
</script>
