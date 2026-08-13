<script setup lang="ts">
import { computed, useId } from 'vue';

import UiTooltip from '../tooltip/UiTooltip.vue';

interface Props {
  error?: string;
  headClass?: string;
  hint?: string;
  horizontal?: boolean;
  id?: string;
  label?: string;
  required?: boolean;
}

const {
  error,
  headClass,
  hint,
  horizontal = false,
  id = useId(),
  label,
  required = false,
} = defineProps<Props>();

const errorId = `${id}-error`;
const hintId = `${id}-hint`;
const describedBy = computed(
  () => [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined,
);
</script>

<template>
  <div :class="[$style.field, { [$style.isHorizontal]: horizontal }]">
    <div :class="[$style.head, headClass]">
      <label
        v-if="label || $slots.label"
        :class="$style.label"
        :for="id"
      >
        <slot name="label">{{ label }}</slot>

        <UiTooltip
          v-if="required"
          content="Обязательное поле"
        >
          <template #trigger>
            <span
              aria-hidden="true"
              :class="$style.required"
            >
              *
            </span>
          </template>
        </UiTooltip>
      </label>

      <slot name="labelRight" />
    </div>

    <div :class="$style.content">
      <slot
        :id="id"
        :described-by="describedBy"
        :is-invalid="error ? true : undefined"
      />

      <p
        v-if="hint"
        :id="hintId"
        :class="$style.hint"
      >
        {{ hint }}
      </p>

      <p
        v-if="error"
        :id="errorId"
        :class="$style.error"
        role="alert"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<style module>
.field {
  display: grid;
  gap: 8px;
}

.head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.label {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}

.required {
  color: var(--color-error);
}

.content {
  min-width: 0;
}

.hint,
.error {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 18px;
}

.hint {
  color: var(--color-text-secondary);
}

.error {
  color: var(--color-error);
}

.isHorizontal {
  grid-template-columns: minmax(140px, 0.35fr) minmax(0, 1fr);
  align-items: start;
}

@media (max-width: 640px) {
  .isHorizontal {
    grid-template-columns: 1fr;
  }
}
</style>
