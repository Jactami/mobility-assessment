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
        class="z-50 max-w-md min-w-56 origin-top-right rounded-border bg-surface-container-lowest p-1 text-on-surface shadow-md ring ring-outline-variant focus:outline-none"
        :style="floatingStyles"
      >
        <!-- Menu Header -->
        <template v-if="$slots.start">
          <div class="p-2">
            <slot name="start">
              <!-- Content before the menu items goes here. -->
            </slot>
          </div>
          <hr class="my-1 border-outline-variant" />
        </template>

        <!-- Menu Items -->
        <div>
          <template v-for="item in items" :key="item.label">
            <MenuItem v-slot="{ active }" :disabled="item.disabled">
              <component
                :is="item.link && !item.disabled ? 'RouterLink' : 'div'"
                :to="item.link"
                class="flex w-full items-center gap-x-1.5 rounded-border p-2"
                :class="[
                  {
                    'cursor-pointer bg-surface-container': active && !item.disabled,
                    'cursor-not-allowed opacity-50': item.disabled,
                  },
                ]"
                @click="handleAction(item)"
              >
                <UIIcon v-if="item.icon" :icon="item.icon" />
                <div class="flex-1">{{ item.label }}</div>
              </component>
            </MenuItem>
            <hr v-if="item.divider" class="my-1 border-outline-variant" />
          </template>
        </div>

        <!-- Menu Footer -->
        <template v-if="$slots.end">
          <hr class="my-1 border-outline-variant" />
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
import {
  autoUpdate,
  flip,
  offset,
  useFloating,
  type Placement,
  type Strategy,
} from '@floating-ui/vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UIButtonIcon from '../button/UIButtonIcon.vue'
import UIIcon from '../icon/UIIcon.vue'
import type { MenuListItem } from './types'

interface Props {
  items: MenuListItem[]
  position?: Placement
  strategy?: Strategy
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-start',
  strategy: 'absolute',
})

const { t } = useI18n()

const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: props.position,
  strategy: props.strategy,
  middleware: [offset(5), flip()],
  transform: false,
  whileElementsMounted: (refEl, floatEl, update) =>
    autoUpdate(refEl, floatEl, update, {
      animationFrame: true,
    }),
})

function handleAction(item: MenuListItem) {
  if (item.disabled) return
  if (!item.action) return

  item.action()
}
</script>
