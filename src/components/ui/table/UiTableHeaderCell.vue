<script setup lang="ts">
import type { TUiTableAlign, TUiTableSortDirection } from './types';

import { computed } from 'vue';

import { UiButtonBase } from '@ui/primitives';

interface Props {
  align?: TUiTableAlign;
  label: string;
  sortable?: boolean;
  sortDirection?: TUiTableSortDirection;
}

interface SortPresentation {
  ariaSort: 'ascending' | 'descending';
  marker: string;
}

type ActiveSortDirection = Exclude<TUiTableSortDirection, null>;

const { align = 'left', label, sortable = false, sortDirection = null } = defineProps<Props>();

defineEmits<{
  sort: [];
}>();

const DEFAULT_SORT_PRESENTATION = {
  ariaSort: 'none',
  marker: '↕',
} as const;

const SORT_PRESENTATION_BY_DIRECTION = {
  asc: {
    ariaSort: 'ascending',
    marker: '↑',
  },
  desc: {
    ariaSort: 'descending',
    marker: '↓',
  },
} as const satisfies Record<ActiveSortDirection, SortPresentation>;

const sortPresentation = computed(() => {
  if (!sortable || !sortDirection) {
    return DEFAULT_SORT_PRESENTATION;
  }

  return SORT_PRESENTATION_BY_DIRECTION[sortDirection];
});
</script>

<template>
  <th
    :aria-sort="sortPresentation.ariaSort"
    :class="[$style.cell, $style[`align-${align}`]]"
    scope="col"
  >
    <UiButtonBase
      v-if="sortable"
      :aria-label="`${label}. Изменить сортировку`"
      :class="$style.sortButton"
      @click="$emit('sort')"
    >
      <span>{{ label }}</span>
      <span
        aria-hidden="true"
        :class="[$style.sortMarker, { [$style.isActive]: sortDirection }]"
      >
        {{ sortPresentation.marker }}
      </span>
    </UiButtonBase>
    <span v-else>{{ label }}</span>
  </th>
</template>

<style module>
.cell {
  position: sticky;
  z-index: 1;
  top: 0;
  padding: 13px 18px;
  border-bottom: 1px solid var(--color-border-secondary);
  background: var(--color-surface-page);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  white-space: nowrap;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}

.sortButton {
  display: inline-flex;
  align-items: center;
  justify-content: inherit;
  gap: 7px;
  padding: 3px 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.sortButton:hover {
  color: var(--color-primary-hover);
}

.sortMarker {
  color: var(--color-text-disabled);
  font-size: 16px;
}

.sortMarker.isActive {
  color: var(--color-primary);
}
</style>
