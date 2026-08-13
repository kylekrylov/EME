<script setup lang="ts">
import type { TTodoFilter } from '@/stores/todo';

import { computed } from 'vue';

import { TODO_FILTERS } from '@/stores/todo';
import { UiButton } from '@ui';

interface Props {
  activeCount: number;
  completedCount: number;
  totalCount: number;
}

const { activeCount, completedCount, totalCount } = defineProps<Props>();

const activeFilter = defineModel<TTodoFilter>({ required: true });

const filterItems = computed(() => [
  {
    count: totalCount,
    label: 'Все',
    value: TODO_FILTERS.ALL,
  },
  {
    count: activeCount,
    label: 'Активные',
    value: TODO_FILTERS.ACTIVE,
  },
  {
    count: completedCount,
    label: 'Выполненные',
    value: TODO_FILTERS.COMPLETED,
  },
]);
</script>

<template>
  <div
    aria-label="Фильтр задач"
    :class="$style.filters"
    role="group"
  >
    <UiButton
      v-for="filterItem in filterItems"
      :key="filterItem.value"
      :active="activeFilter === filterItem.value"
      appearance="secondary"
      :aria-pressed="activeFilter === filterItem.value"
      size="sm"
      type="button"
      @click="activeFilter = filterItem.value"
    >
      {{ filterItem.label }} · {{ filterItem.count }}
    </UiButton>
  </div>
</template>

<style lang="scss" module>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
