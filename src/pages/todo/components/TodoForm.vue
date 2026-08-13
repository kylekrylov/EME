<script setup lang="ts">
import { ref, useId, watch } from 'vue';

import { TODO_TITLE_MAX_LENGTH } from '@/stores/todo';
import { UiButton, UiInput } from '@ui';

const emit = defineEmits<{
  add: [title: string];
}>();

const inputId = useId();
const errorId = useId();
const title = ref('');
const errorMessage = ref('');

watch(title, () => {
  errorMessage.value = '';
});

function submitTask() {
  const normalizedTitle = title.value.trim();

  if (!normalizedTitle) {
    errorMessage.value = 'Введите название задачи.';
    return;
  }

  emit('add', normalizedTitle);
  title.value = '';
}
</script>

<template>
  <form
    :class="$style.form"
    @submit.prevent="submitTask"
  >
    <label
      :class="$style.label"
      :for="inputId"
    >
      Новая задача
    </label>

    <div :class="$style.controls">
      <UiInput
        :id="inputId"
        v-model="title"
        :appearance="errorMessage ? 'error' : 'default'"
        :aria-describedby="errorMessage ? errorId : undefined"
        autocomplete="off"
        :class="$style.input"
        :maxlength="TODO_TITLE_MAX_LENGTH"
        placeholder="Например, подготовить отчёт"
      />
      <UiButton type="submit">Добавить</UiButton>
    </div>

    <p
      v-if="errorMessage"
      :id="errorId"
      :class="$style.error"
      role="alert"
    >
      {{ errorMessage }}
    </p>
  </form>
</template>

<style lang="scss" module>
.form {
  padding: 24px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 20px;
  background: var(--color-surface-base);
}

.label {
  display: block;
  margin-bottom: 10px;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}

.controls {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.input {
  flex: 1;
}

.error {
  margin: 8px 0 0;
  color: var(--color-error);
  font-size: 13px;
  line-height: 18px;
}

@media (max-width: 560px) {
  .controls {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
