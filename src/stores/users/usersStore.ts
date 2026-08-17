import type {
  TUsersRoleFilter,
  TUsersSortDirection,
  TUsersSortKey,
  TUsersStatusFilter,
} from './types';
import type { IUser } from '@/api/users';

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import { getUsers } from '@/api/users';

import { USERS_DEFAULT_PAGE_SIZE, USERS_FILTER_ALL, USERS_PAGE_SIZES } from './constants';

type ActiveUsersSortDirection = Exclude<TUsersSortDirection, null>;

const SORT_DIRECTION_MULTIPLIER = {
  asc: 1,
  desc: -1,
} as const satisfies Record<ActiveUsersSortDirection, number>;

const usersCollator = new Intl.Collator('ru-RU', { numeric: true, sensitivity: 'base' });

export const useUsersStore = defineStore('users', () => {
  const users = ref<IUser[]>([]);
  const errorMessage = ref('');
  const isLoading = ref(false);
  const currentPage = ref(1);
  const pageSize = ref<number>(USERS_DEFAULT_PAGE_SIZE);
  const roleFilter = ref<TUsersRoleFilter>(USERS_FILTER_ALL);
  const statusFilter = ref<TUsersStatusFilter>(USERS_FILTER_ALL);
  const sortDirection = ref<TUsersSortDirection>(null);
  const sortKey = ref<TUsersSortKey>();

  let requestController: AbortController | null = null;

  const filteredUsers = computed(() =>
    users.value.filter((user) => {
      const matchesRole = roleFilter.value === USERS_FILTER_ALL || user.role === roleFilter.value;
      const matchesStatus =
        statusFilter.value === USERS_FILTER_ALL || user.status === statusFilter.value;

      return matchesRole && matchesStatus;
    }),
  );

  const sortedUsers = computed(() => {
    const activeSortDirection = sortDirection.value;

    if (!sortKey.value || !activeSortDirection) {
      return filteredUsers.value;
    }

    const activeSortKey = sortKey.value;

    return [...filteredUsers.value].sort(
      (firstUser, secondUser) =>
        usersCollator.compare(firstUser[activeSortKey], secondUser[activeSortKey]) *
        SORT_DIRECTION_MULTIPLIER[activeSortDirection],
    );
  });

  const totalItems = computed(() => sortedUsers.value.length);
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / pageSize.value)));
  const paginatedUsers = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value;
    return sortedUsers.value.slice(startIndex, startIndex + pageSize.value);
  });

  watch([roleFilter, statusFilter, pageSize], () => {
    currentPage.value = 1;
  });

  watch(totalPages, (pagesCount) => {
    if (currentPage.value > pagesCount) {
      currentPage.value = pagesCount;
    }
  });

  async function loadUsers() {
    requestController?.abort();

    const currentController = new AbortController();
    requestController = currentController;
    errorMessage.value = '';
    isLoading.value = true;

    try {
      users.value = await getUsers(currentController.signal);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      errorMessage.value = 'Не удалось загрузить пользователей. Попробуйте ещё раз.';
    } finally {
      if (requestController === currentController) {
        requestController = null;
        isLoading.value = false;
      }
    }
  }

  function cancelLoading() {
    requestController?.abort();
    requestController = null;
    isLoading.value = false;
  }

  function setPageSize(value: number) {
    if ((USERS_PAGE_SIZES as readonly number[]).includes(value)) {
      pageSize.value = value;
    }
  }

  function setRoleFilter(value: TUsersRoleFilter) {
    roleFilter.value = value;
  }

  function setSort(key: TUsersSortKey) {
    if (sortKey.value !== key) {
      sortKey.value = key;
      sortDirection.value = 'asc';
      return;
    }

    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc';
      return;
    }

    if (sortDirection.value === 'desc') {
      sortKey.value = undefined;
      sortDirection.value = null;
      return;
    }

    sortDirection.value = 'asc';
  }

  function setStatusFilter(value: TUsersStatusFilter) {
    statusFilter.value = value;
  }

  return {
    cancelLoading,
    currentPage,
    errorMessage,
    isLoading,
    loadUsers,
    pageSize,
    paginatedUsers,
    roleFilter,
    setPageSize,
    setRoleFilter,
    setSort,
    setStatusFilter,
    sortDirection,
    sortKey,
    statusFilter,
    totalItems,
    totalPages,
    users,
  };
});
