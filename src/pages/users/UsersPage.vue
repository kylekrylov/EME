<script setup lang="ts">
import type { IUser } from '@/api/users';
import type { TUsersSortKey } from '@/stores/users';
import type { TUiSelectValue } from '@ui';

import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted } from 'vue';

import PageHeader from '@/components/layout/PageHeader.vue';
import { useUsersStore } from '@/stores/users';
import { UiAlert, UiButton, UiField, UiPagination, UiSelect, UiTable, UiTag } from '@ui';

import {
  isUsersRoleFilter,
  isUsersStatusFilter,
  USER_PAGE_SIZE_OPTIONS,
  USER_ROLE_FILTER_OPTIONS,
  USER_ROLE_LABELS,
  USER_ROLE_TAG_COLORS,
  USER_STATUS_FILTER_OPTIONS,
  USER_STATUS_LABELS,
  USER_STATUS_TAG_COLORS,
  USER_TABLE_COLUMNS,
} from './constants';
import { formatRegistrationDate } from './utils';

const usersStore = useUsersStore();
const {
  currentPage,
  errorMessage,
  isLoading,
  pageSize,
  paginatedUsers,
  roleFilter,
  sortDirection,
  sortKey,
  statusFilter,
  totalItems,
  users,
} = storeToRefs(usersStore);
const { cancelLoading, loadUsers, setPageSize, setRoleFilter, setSort, setStatusFilter } =
  usersStore;

function handlePageSizeUpdate(value: TUiSelectValue) {
  if (typeof value === 'number') {
    setPageSize(value);
  }
}

function handleRoleFilterUpdate(value: TUiSelectValue) {
  if (isUsersRoleFilter(value)) {
    setRoleFilter(value);
  }
}

function handleSort(key: keyof IUser & string) {
  setSort(key as TUsersSortKey);
}

function handleStatusFilterUpdate(value: TUiSelectValue) {
  if (isUsersStatusFilter(value)) {
    setStatusFilter(value);
  }
}

onMounted(loadUsers);
onBeforeUnmount(cancelLoading);
</script>

<template>
  <section :class="$style.page">
    <PageHeader>
      <template #title>Таблица пользователей</template>
      <template #requirements>
        Вывод пользователей, сортировка по столбцам, фильтры по роли и статусу, пагинация.
      </template>
      <template #implementation>
        JSONPlaceholder, типизированный API-слой и Pinia store с клиентской обработкой данных.
      </template>
      <template #aside>Найдено: {{ totalItems }}</template>
    </PageHeader>

    <div
      aria-label="Фильтры таблицы"
      :class="$style.filters"
      role="group"
    >
      <UiField
        v-slot="{ id }"
        label="Роль"
      >
        <UiSelect
          :id="id"
          :disabled="isLoading"
          :model-value="roleFilter"
          :options="USER_ROLE_FILTER_OPTIONS"
          @update:model-value="handleRoleFilterUpdate"
        />
      </UiField>

      <UiField
        v-slot="{ id }"
        label="Статус"
      >
        <UiSelect
          :id="id"
          :disabled="isLoading"
          :model-value="statusFilter"
          :options="USER_STATUS_FILTER_OPTIONS"
          @update:model-value="handleStatusFilterUpdate"
        />
      </UiField>

      <UiField
        v-slot="{ id }"
        label="Строк на странице"
      >
        <UiSelect
          :id="id"
          :disabled="isLoading"
          :model-value="pageSize"
          :options="USER_PAGE_SIZE_OPTIONS"
          @update:model-value="handlePageSizeUpdate"
        />
      </UiField>
    </div>

    <UiAlert
      v-if="errorMessage"
      appearance="error"
      :class="$style.alert"
      :closable="false"
      :text="errorMessage"
      title="Ошибка загрузки"
    >
      <UiButton
        :class="$style.retryButton"
        size="sm"
        type="button"
        @click="loadUsers"
      >
        Повторить
      </UiButton>
    </UiAlert>

    <UiTable
      v-if="!errorMessage || users.length"
      :class="$style.table"
      :columns="USER_TABLE_COLUMNS"
      :loading="isLoading"
      name="Пользователи"
      row-key="id"
      :rows="paginatedUsers"
      :sort-direction="sortDirection"
      :sort-key="sortKey"
      @sort="handleSort"
    >
      <template #cell-email="{ row }">
        <a
          :class="$style.email"
          :href="`mailto:${row.email}`"
        >
          {{ row.email }}
        </a>
      </template>

      <template #cell-role="{ row }">
        <UiTag
          :color="USER_ROLE_TAG_COLORS[row.role]"
          size="sm"
        >
          {{ USER_ROLE_LABELS[row.role] }}
        </UiTag>
      </template>

      <template #cell-status="{ row }">
        <UiTag
          :color="USER_STATUS_TAG_COLORS[row.status]"
          size="sm"
        >
          {{ USER_STATUS_LABELS[row.status] }}
        </UiTag>
      </template>

      <template #cell-registeredAt="{ row }">
        <time :datetime="row.registeredAt">
          {{ formatRegistrationDate(row.registeredAt) }}
        </time>
      </template>

      <template #empty> Ничего не найдено. Попробуйте изменить фильтры. </template>
    </UiTable>

    <UiPagination
      v-if="!isLoading && !errorMessage"
      v-model="currentPage"
      :class="$style.pagination"
      :page-size="pageSize"
      :total-items="totalItems"
    />
  </section>
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  overflow: hidden;
}

.filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 28px 0 20px;
  padding: 20px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 16px;
  background: var(--color-surface-base);
}

.alert {
  flex: 0 0 auto;
  margin-bottom: 20px;
}

.table {
  flex: 1;
  min-height: 0;
}

.retryButton {
  margin-top: 12px;
}

.email {
  color: var(--color-primary-active);
  text-decoration: none;
}

.email:hover {
  text-decoration: underline;
}

.pagination {
  flex: 0 0 auto;
  margin-top: 18px;
}

@media (max-width: 760px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
