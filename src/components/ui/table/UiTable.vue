<script setup lang="ts" generic="TRow">
import type { IUiTableColumn, TUiTableSortDirection } from './types';

import UiSkeleton from '../skeleton/UiSkeleton.vue';
import { getTableColumnStyles } from './helpers';
import UiTableCell from './UiTableCell.vue';
import UiTableHeaderCell from './UiTableHeaderCell.vue';
import UiTableRow from './UiTableRow.vue';

interface Props {
  columns: readonly IUiTableColumn<TRow>[];
  emptyText?: string;
  loading?: boolean;
  loadingRows?: number;
  name: string;
  rowKey: keyof TRow & string;
  rows: readonly TRow[];
  sortDirection?: TUiTableSortDirection;
  sortKey?: keyof TRow & string;
}

const {
  columns,
  emptyText = 'Нет данных для отображения.',
  loading = false,
  loadingRows = 8,
  rowKey,
  rows,
  sortDirection = null,
  sortKey,
} = defineProps<Props>();

defineEmits<{
  sort: [key: keyof TRow & string];
}>();

function getRowKey(row: TRow) {
  return String(row[rowKey]);
}
</script>

<template>
  <div :class="$style.wrapper">
    <table
      :aria-busy="loading || undefined"
      :class="$style.table"
    >
      <caption :class="$style.caption">
        {{
          name
        }}
      </caption>

      <thead>
        <tr>
          <UiTableHeaderCell
            v-for="column in columns"
            :key="column.key"
            :align="column.align"
            :label="column.label"
            :sortable="column.sortable"
            :sort-direction="sortKey === column.key ? sortDirection : null"
            :style="getTableColumnStyles(column)"
            @sort="$emit('sort', column.key)"
          />
        </tr>
      </thead>

      <tbody>
        <template v-if="loading">
          <UiTableRow
            v-for="rowIndex in loadingRows"
            :key="rowIndex"
            disable-hover
          >
            <UiTableCell
              v-for="column in columns"
              :key="column.key"
              :align="column.align"
              :style="getTableColumnStyles(column)"
            >
              <UiSkeleton :class="$style.skeleton" />
            </UiTableCell>
          </UiTableRow>
        </template>

        <tr v-else-if="!rows.length">
          <td
            :class="$style.empty"
            :colspan="columns.length"
          >
            <slot name="empty">{{ emptyText }}</slot>
          </td>
        </tr>

        <template v-else>
          <UiTableRow
            v-for="(row, rowIndex) in rows"
            :key="getRowKey(row)"
          >
            <UiTableCell
              v-for="column in columns"
              :key="column.key"
              :align="column.align"
              :style="getTableColumnStyles(column)"
            >
              <slot
                :name="`cell-${column.key}`"
                :column="column"
                :row="row"
                :row-index="rowIndex"
                :value="row[column.key]"
              >
                {{ row[column.key] ?? '—' }}
              </slot>
            </UiTableCell>
          </UiTableRow>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style module>
.wrapper {
  width: 100%;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--color-border-secondary);
  border-radius: 16px;
  background: var(--color-surface-base);
  scrollbar-gutter: stable;
}

.table {
  width: 100%;
  min-width: 780px;
  border-spacing: 0;
  border-collapse: separate;
}

.caption {
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.empty {
  height: 220px;
  padding: 32px;
  color: var(--color-text-secondary);
  text-align: center;
}

.skeleton {
  width: 82%;
  height: 16px;
}
</style>
