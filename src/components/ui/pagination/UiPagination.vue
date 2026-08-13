<script setup lang="ts">
import { computed, watch } from 'vue';
import { UiButtonBase } from '@ui/primitives';

interface Props {
  pageSize: number;
  totalItems: number;
}

const { pageSize, totalItems } = defineProps<Props>();

const currentPage = defineModel<number>({ required: true });

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems / pageSize)));
const firstItem = computed(() => (totalItems ? (currentPage.value - 1) * pageSize + 1 : 0));
const lastItem = computed(() => Math.min(currentPage.value * pageSize, totalItems));
const paginationItems = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages.value,
    currentPage.value - 1,
    currentPage.value,
    currentPage.value + 1,
  ]);
  const visiblePages = [...pages]
    .filter((page) => {
      return page >= 1 && page <= totalPages.value;
    })
    .sort((firstPage, secondPage) => firstPage - secondPage);
  const items: Array<number | string> = [];

  visiblePages.forEach((page, index) => {
    const previousPage = visiblePages[index - 1];

    if (previousPage && page - previousPage > 1) {
      items.push(`ellipsis-${previousPage}`);
    }

    items.push(page);
  });

  return items;
});

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
}

watch(totalPages, (pagesCount) => {
  if (currentPage.value > pagesCount) {
    currentPage.value = pagesCount;
  }
});
</script>

<template>
  <nav
    aria-label="Пагинация таблицы пользователей"
    :class="$style.pagination"
  >
    <p :class="$style.summary">Показано {{ firstItem }}–{{ lastItem }} из {{ totalItems }}</p>

    <div :class="$style.controls">
      <UiButtonBase
        aria-label="Предыдущая страница"
        :class="$style.button"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        ‹
      </UiButtonBase>

      <template
        v-for="item in paginationItems"
        :key="item"
      >
        <span
          v-if="typeof item === 'string'"
          aria-hidden="true"
          :class="$style.ellipsis"
        >
          {{ '…' }}
        </span>
        <UiButtonBase
          v-else
          :aria-current="item === currentPage ? 'page' : undefined"
          :aria-label="`Страница ${item}`"
          :class="[$style.button, { [$style.isActive]: item === currentPage }]"
          @click="goToPage(item)"
        >
          {{ item }}
        </UiButtonBase>
      </template>

      <UiButtonBase
        aria-label="Следующая страница"
        :class="$style.button"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        ›
      </UiButtonBase>
    </div>
  </nav>
</template>

<style module>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.summary {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 20px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.button {
  display: grid;
  place-items: center;
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 10px;
  background: var(--color-surface-base);
  color: var(--color-text-primary);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.button:hover:not(:disabled) {
  border-color: var(--color-primary-disabled);
  background: var(--color-surface-primary-soft);
  color: var(--color-primary-hover);
}

.button.isActive {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.button:disabled {
  border-color: var(--color-surface-disabled);
  background: var(--color-surface-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.ellipsis {
  min-width: 22px;
  color: var(--color-text-disabled);
  text-align: center;
}

@media (max-width: 620px) {
  .pagination {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
