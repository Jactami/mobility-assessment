<template>
  <Menu as="div" class="relative inline-block">
    <!-- Trigger -->
    <MenuButton ref="reference" as="div" @click.prevent>
      <slot name="trigger">
        <!-- Fallback trigger -->
        <IconButton icon="more" />
      </slot>
    </MenuButton>

    <!-- Popup -->
    <Teleport to="body">
      <MenuItems
        ref="floating"
        class="z-50 max-w-md min-w-56 origin-top-right divide-y divide-outline-variant rounded-border bg-surface p-1 text-on-surface shadow-md ring ring-outline-variant focus:outline-none"
        :style="floatingStyles"
      >
        <!-- Menu Header -->
        <template v-if="$slots.start">
          <div class="p-2">
            <slot name="start">
              <!-- Content before the menu items goes here. -->
            </slot>
          </div>
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
                <IconRenderer v-if="item.icon" :icon="item.icon" />
                <div class="flex-1">{{ item.label }}</div>
              </component>
            </MenuItem>
            <hr v-if="item.divider" class="my-1 border-outline-variant" />
          </template>
        </div>

        <!-- Menu Footer -->
        <template v-if="$slots.end">
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
import IconButton from '@/components/icon/IconButton.vue'
import IconRenderer from '@/components/icon/IconRenderer.vue'
import { autoUpdate, flip, offset, useFloating, type Placement } from '@floating-ui/vue'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ref } from 'vue'
import type { MenuActionItem } from './types'

interface Props {
  items: MenuActionItem[]
  placement?: Placement
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'top-start',
})

const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: props.placement,
  middleware: [offset(5), flip()],
  whileElementsMounted: autoUpdate,
})

function handleAction(item: MenuActionItem) {
  if (item.disabled) return
  if (!item.action) return

  item.action()
}
</script>
