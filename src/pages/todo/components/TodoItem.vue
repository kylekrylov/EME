<script setup lang="ts">
import type { ITodoTask } from '@/stores/todo';

import { nextTick, ref, useId, useTemplateRef } from 'vue';

import { TODO_TITLE_MAX_LENGTH } from '@/stores/todo';
import { UiButton, UiButtonIcon, UiCheckbox, UiInput } from '@ui';

interface Props {
  task: ITodoTask;
}

const { task } = defineProps<Props>();

const emit = defineEmits<{
  delete: [taskId: string];
  toggle: [taskId: string];
  update: [taskId: string, title: string];
}>();

const editInput = useTemplateRef<InstanceType<typeof UiInput>>('editInput');
const editErrorId = useId();
const draftTitle = ref('');
const editErrorMessage = ref('');
const isEditing = ref(false);

function cancelEditing() {
  editErrorMessage.value = '';
  isEditing.value = false;
}

function saveTask() {
  const normalizedTitle = draftTitle.value.trim();

  if (!normalizedTitle) {
    editErrorMessage.value = 'Название задачи не может быть пустым.';
    return;
  }

  emit('update', task.id, normalizedTitle);
  isEditing.value = false;
}

async function startEditing() {
  draftTitle.value = task.title;
  editErrorMessage.value = '';
  isEditing.value = true;

  await nextTick();
  editInput.value?.select();
}

function toggleTask() {
  emit('toggle', task.id);
}
</script>

<template>
  <li :class="[$style.item, { [$style.isCompleted]: task.isCompleted }]">
    <UiCheckbox
      :aria-label="task.isCompleted ? 'Вернуть задачу в активные' : 'Отметить задачу выполненной'"
      :class="$style.checkbox"
      :model-value="task.isCompleted"
      size="lg"
      @update:model-value="toggleTask"
    />

    <form
      v-if="isEditing"
      :class="$style.editForm"
      @submit.prevent="saveTask"
    >
      <UiInput
        ref="editInput"
        v-model="draftTitle"
        :appearance="editErrorMessage ? 'error' : 'default'"
        :aria-describedby="editErrorMessage ? editErrorId : undefined"
        aria-label="Название задачи"
        :clearable="false"
        :maxlength="TODO_TITLE_MAX_LENGTH"
        @keydown.esc.prevent="cancelEditing"
      />

      <div :class="$style.editActions">
        <UiButton
          appearance="secondary"
          size="sm"
          type="button"
          @click="cancelEditing"
        >
          Отмена
        </UiButton>
        <UiButton
          size="sm"
          type="submit"
        >
          Сохранить
        </UiButton>
      </div>

      <p
        v-if="editErrorMessage"
        :id="editErrorId"
        :class="$style.error"
        role="alert"
      >
        {{ editErrorMessage }}
      </p>
    </form>

    <template v-else>
      <span :class="$style.title">{{ task.title }}</span>

      <div :class="$style.actions">
        <UiButtonIcon
          icon="edit"
          :label="`Редактировать задачу «${task.title}»`"
          size="sm"
          type="button"
          @click="startEditing"
        />
        <UiButtonIcon
          color-icon="var(--color-error)"
          icon="trash"
          :label="`Удалить задачу «${task.title}»`"
          size="sm"
          type="button"
          @click="emit('delete', task.id)"
        />
      </div>
    </template>
  </li>
</template>

<style lang="scss" module>
.item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 20px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 16px;
  background: var(--color-surface-base);
  transition:
    border-color 0.2s,
    opacity 0.2s;

  &:hover {
    border-color: var(--color-primary-disabled);
  }
}

.checkbox {
  margin-top: 3px;
}

.title {
  flex: 1;
  min-width: 0;
  color: var(--color-text-primary);
  font-size: 16px;
  line-height: 24px;
  overflow-wrap: anywhere;
}

.isCompleted .title {
  color: var(--color-text-disabled);
  text-decoration: line-through;
}

.actions {
  display: flex;
  flex: 0 0 auto;
  gap: 12px;
}

.editForm {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  flex: 1;
  gap: 10px;
  min-width: 0;
}

.editActions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error {
  grid-column: 1 / -1;
  margin: -2px 0 0;
  color: var(--color-error);
  font-size: 13px;
  line-height: 18px;
}

@media (max-width: 640px) {
  .item {
    padding: 16px;
  }

  .editForm {
    grid-template-columns: 1fr;
  }

  .editActions {
    justify-content: flex-end;
  }
}
</style>
