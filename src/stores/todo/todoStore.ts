import type { ITodoStorageState, ITodoTask, TTodoFilter } from './types';

import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import {
  TODO_FILTERS,
  TODO_STORAGE_KEY,
  TODO_STORAGE_VERSION,
  TODO_TITLE_MAX_LENGTH,
} from './constants';

export const useTodoStore = defineStore('todo', () => {
  const tasks = ref<ITodoTask[]>(readStoredTasks());
  const activeFilter = ref<TTodoFilter>(TODO_FILTERS.ALL);

  const activeCount = computed(() => tasks.value.filter(({ isCompleted }) => !isCompleted).length);
  const completedCount = computed(() => tasks.value.length - activeCount.value);
  const filteredTasks = computed(() => {
    if (activeFilter.value === TODO_FILTERS.ACTIVE) {
      return tasks.value.filter(({ isCompleted }) => !isCompleted);
    }

    if (activeFilter.value === TODO_FILTERS.COMPLETED) {
      return tasks.value.filter(({ isCompleted }) => isCompleted);
    }

    return tasks.value;
  });

  watch(tasks, persistTasks, { deep: true, flush: 'sync' });

  function addTask(title: string) {
    const normalizedTitle = normalizeTitle(title);

    if (!normalizedTitle) {
      return null;
    }

    const task: ITodoTask = {
      id: crypto.randomUUID(),
      isCompleted: false,
      title: normalizedTitle,
    };

    tasks.value.unshift(task);
    return task.id;
  }

  function removeTask(taskId: string) {
    const taskIndex = tasks.value.findIndex(({ id }) => id === taskId);

    if (taskIndex === -1) {
      return false;
    }

    tasks.value.splice(taskIndex, 1);
    return true;
  }

  function setFilter(filter: TTodoFilter) {
    activeFilter.value = filter;
  }

  function toggleTask(taskId: string) {
    const task = tasks.value.find(({ id }) => id === taskId);

    if (!task) {
      return false;
    }

    task.isCompleted = !task.isCompleted;
    return true;
  }

  function updateTask(taskId: string, title: string) {
    const task = tasks.value.find(({ id }) => id === taskId);
    const normalizedTitle = normalizeTitle(title);

    if (!task || !normalizedTitle) {
      return false;
    }

    task.title = normalizedTitle;
    return true;
  }

  function persistTasks() {
    const storageState: ITodoStorageState = {
      tasks: tasks.value,
      version: TODO_STORAGE_VERSION,
    };

    try {
      localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(storageState));
    } catch {
      // The application remains usable when storage is unavailable or full.
    }
  }

  return {
    activeCount,
    activeFilter,
    addTask,
    completedCount,
    filteredTasks,
    removeTask,
    setFilter,
    tasks,
    toggleTask,
    updateTask,
  };
});

function normalizeTitle(title: string) {
  return title.trim().slice(0, TODO_TITLE_MAX_LENGTH);
}

function readStoredTasks() {
  try {
    const rawStorageState = localStorage.getItem(TODO_STORAGE_KEY);

    if (!rawStorageState) {
      return [];
    }

    const storageState: unknown = JSON.parse(rawStorageState);

    if (!isTodoStorageState(storageState) || storageState.version !== TODO_STORAGE_VERSION) {
      return [];
    }

    return storageState.tasks;
  } catch {
    return [];
  }
}

function isTodoStorageState(value: unknown): value is ITodoStorageState {
  if (!isRecord(value) || !Array.isArray(value.tasks) || typeof value.version !== 'number') {
    return false;
  }

  return value.tasks.every(isTodoTask);
}

function isTodoTask(value: unknown): value is ITodoTask {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.isCompleted === 'boolean' &&
    typeof value.title === 'string' &&
    value.title.trim().length > 0
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
