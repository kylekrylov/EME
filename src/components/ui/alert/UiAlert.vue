<script setup lang="ts">
import type { TAlertAppearance } from '@ui/types';

import { computed } from 'vue';

import { UiButtonIcon } from '@ui/button-icon';

interface Props {
  appearance?: TAlertAppearance;
  closable?: boolean;
  text?: string;
  title: string;
}

const { appearance = 'info', closable = true } = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const alertRole = computed(() => (appearance === 'error' ? 'alert' : 'status'));
const marker = computed(() => {
  if (appearance === 'success') {
    return '✓';
  }

  if (appearance === 'error' || appearance === 'warning') {
    return '!';
  }

  return 'i';
});
</script>

<template>
  <div
    :aria-live="appearance === 'error' ? 'assertive' : 'polite'"
    :class="[$style.alert, $style[`appearance-${appearance}`]]"
    :role="alertRole"
  >
    <span
      aria-hidden="true"
      :class="$style.marker"
    >
      {{ marker }}
    </span>

    <div :class="$style.content">
      <h2 :class="$style.title">{{ title }}</h2>
      <p
        v-if="text"
        :class="$style.text"
      >
        {{ text }}
      </p>
      <slot />
    </div>

    <UiButtonIcon
      v-if="closable"
      :class="$style.closeButton"
      icon="close"
      label="Закрыть сообщение"
      size="sm"
      type="button"
      @click="$emit('close')"
    />
  </div>
</template>

<style module>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--alert-color);
  border-radius: 16px;
  background: var(--alert-background);
  color: var(--color-text-primary);
}

.appearance-info {
  --alert-background: var(--color-surface-primary-soft);
  --alert-color: var(--color-primary);
}

.appearance-success {
  --alert-background: var(--color-success-soft);
  --alert-color: var(--color-success);
}

.appearance-warning {
  --alert-background: var(--color-warning-soft);
  --alert-color: var(--color-warning);
}

.appearance-error {
  --alert-background: var(--color-error-soft);
  --alert-color: var(--color-error);
}

.marker {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--alert-color);
  color: var(--color-text-inverse);
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
}

.content {
  flex: 1;
  min-width: 0;
}

.title {
  margin: 1px 0 0;
  font-size: 16px;
  line-height: 22px;
}

.text {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 20px;
}

.closeButton {
  margin: -2px -2px -2px 0;
}
</style>
