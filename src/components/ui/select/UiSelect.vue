<script setup lang="ts">
import type { IUiSelectOption, TUiSelectValue } from './types';
import type { TInputAppearance, TSize } from '@ui/types';

import { computed, ref, useAttrs } from 'vue';

import { SvgIcon } from '@ui/primitives';

interface Props {
  appearance?: TInputAppearance;
  disabled?: boolean;
  options: readonly IUiSelectOption[];
  placeholder?: string;
  size?: Exclude<TSize, 'sm'>;
}

defineOptions({ inheritAttrs: false });

const {
  appearance = 'default',
  disabled = false,
  options,
  placeholder,
  size = 'md',
} = defineProps<Props>();

const modelValue = defineModel<TUiSelectValue>({ required: true });

const attrs = useAttrs();
const isFocused = ref(false);

const selectAttributes = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attribute]) => attribute !== 'class' && attribute !== 'style'),
  ),
);
</script>

<template>
  <div
    :class="[
      $style.container,
      $style[`appearance-${appearance}`],
      $style[`size-${size}`],
      $attrs.class,
      {
        [$style.isDisabled]: disabled,
        [$style.isFocused]: isFocused,
      },
    ]"
    :style="$attrs.style"
  >
    <select
      v-model="modelValue"
      v-bind="selectAttributes"
      :aria-invalid="appearance === 'error' || undefined"
      :class="$style.select"
      :disabled="disabled"
      @blur="isFocused = false"
      @focus="isFocused = true"
    >
      <option
        v-if="placeholder"
        disabled
        value=""
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :disabled="option.disabled"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <SvgIcon
      :class="$style.arrow"
      name="chevron-down"
      :size="18"
    />
  </div>
</template>

<style module>
.container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  border: 1px solid var(--select-border);
  border-radius: 12px;
  background: var(--color-surface-base);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.container:hover:not(.isDisabled, .isFocused) {
  border-color: var(--select-hover-border);
}

.appearance-default {
  --select-border: var(--color-border-secondary);
  --select-focus-shadow: var(--input-shadow-primary);
  --select-hover-border: var(--color-primary-disabled);
}

.appearance-error {
  --select-border: var(--color-error);
  --select-focus-shadow: var(--input-shadow-error);
  --select-hover-border: var(--color-error-hover);
}

.isFocused:not(.isDisabled) {
  border-color: var(--select-hover-border);
  box-shadow: var(--select-focus-shadow);
}

.isDisabled {
  border-color: var(--color-surface-disabled);
  background: var(--color-surface-disabled);
  cursor: not-allowed;
}

.size-md {
  height: 40px;
}

.size-lg {
  height: 48px;
}

.select {
  width: 100%;
  height: 100%;
  padding: 0 38px 0 12px;
  border: 0;
  outline: 0;
  appearance: none;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  font: inherit;
  font-size: 15px;
}

.select:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  color: var(--color-text-secondary);
  pointer-events: none;
  transform: translateY(-50%);
}

.isDisabled .arrow {
  color: var(--color-text-disabled);
}
</style>
