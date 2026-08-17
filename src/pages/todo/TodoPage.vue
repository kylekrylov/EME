<script setup lang="ts">
import type { TTodoFilter } from '@/stores/todo';

import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

import PageHeader from '@/components/layout/PageHeader.vue';
import { TODO_FILTERS, useTodoStore } from '@/stores/todo';
import { UiButton, UiModal, UiScrollContainer } from '@ui';
import TodoFilters from './components/TodoFilters.vue';
import TodoForm from './components/TodoForm.vue';
import TodoItem from './components/TodoItem.vue';

const EMPTY_STATE_TEXT_BY_FILTER = {
  active: 'Активных задач нет.',
  all: 'Задач для отображения нет.',
  completed: 'Выполненных задач пока нет.',
} as const satisfies Record<TTodoFilter, string>;

const todoStore = useTodoStore();
const { activeCount, activeFilter, completedCount, filteredTasks, tasks } = storeToRefs(todoStore);
const { addTask, removeTask, setFilter, toggleTask, updateTask } = todoStore;

const isDeleteModalOpen = ref(false);
const pendingDeleteTaskId = ref<string | null>(null);

const pendingDeleteTask = computed(() =>
  tasks.value.find(({ id }) => id === pendingDeleteTaskId.value),
);

const emptyStateText = computed(() => {
  if (!tasks.value.length) {
    return 'Пока нет задач. Добавьте первую задачу с помощью формы выше.';
  }

  return EMPTY_STATE_TEXT_BY_FILTER[activeFilter.value];
});

function addTodoTask(title: string) {
  addTask(title);
  setFilter(TODO_FILTERS.ALL);
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false;
  pendingDeleteTaskId.value = null;
}

function confirmTaskDeletion() {
  if (pendingDeleteTaskId.value) {
    removeTask(pendingDeleteTaskId.value);
  }

  closeDeleteModal();
}

function openDeleteModal(taskId: string) {
  pendingDeleteTaskId.value = taskId;
  isDeleteModalOpen.value = true;
}
</script>

<template>
  <section :class="$style.page">
    <PageHeader>
      <template #title>Список задач</template>
      <template #requirements>
        Создание, inline-редактирование, выполнение, фильтрация и подтверждаемое удаление задач.
      </template>
      <template #implementation>
        Pinia управляет состоянием и localStorage, удаление подтверждается через UiModal.
      </template>
      <template #aside>Осталось: {{ activeCount }} · Выполнено: {{ completedCount }}</template>
    </PageHeader>

    <TodoForm
      :class="$style.form"
      @add="addTodoTask"
    />

    <div :class="$style.toolbar">
      <TodoFilters
        :active-count="activeCount"
        :completed-count="completedCount"
        :model-value="activeFilter"
        :total-count="tasks.length"
        @update:model-value="setFilter"
      />
    </div>

    <UiScrollContainer
      aria-label="Список задач"
      :class="$style.tasks"
      tabindex="0"
    >
      <ul
        v-if="filteredTasks.length"
        :class="$style.list"
      >
        <TodoItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @delete="openDeleteModal"
          @toggle="toggleTask"
          @update="updateTask"
        />
      </ul>

      <div
        v-else
        :class="$style.emptyState"
        role="status"
      >
        <p>{{ emptyStateText }}</p>
      </div>
    </UiScrollContainer>

    <UiModal
      v-model:is-open="isDeleteModalOpen"
      aria-label="Подтверждение удаления задачи"
      @close="closeDeleteModal"
    >
      <template #header>
        <h2 :class="$style.modalTitle">Удалить задачу?</h2>
      </template>

      <p :class="$style.modalText">
        Задача «{{ pendingDeleteTask?.title }}» будет удалена без возможности восстановления.
      </p>

      <template #footer>
        <UiButton
          appearance="secondary"
          type="button"
          @click="closeDeleteModal"
        >
          Отмена
        </UiButton>
        <UiButton
          appearance="error"
          type="button"
          @click="confirmTaskDeletion"
        >
          Удалить
        </UiButton>
      </template>
    </UiModal>
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

.form {
  margin-top: 28px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
}

.tasks {
  margin-top: 16px;
}

.list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.emptyState {
  display: grid;
  place-items: center;
  height: 100%;
  min-height: 180px;
  padding: 32px;
  border: 1px dashed var(--color-border-secondary);
  border-radius: 20px;
  color: var(--color-text-secondary);
  text-align: center;
}

.emptyState p,
.modalText {
  margin: 0;
}

.modalTitle {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 20px;
  line-height: 28px;
}

.modalText {
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 24px;
}
</style>
