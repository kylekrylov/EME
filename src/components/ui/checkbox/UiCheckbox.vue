<script setup lang="ts">
import type { TSize } from '@ui/types';
import { computed, useAttrs } from 'vue';
import { SvgIcon } from '@ui/primitives';

defineOptions({ inheritAttrs: false });

const { disabled = false, size = 'md' } = defineProps<Props>();

interface Props {
  disabled?: boolean;
  size?: Exclude<TSize, 'sm'>;
}

const modelValue = defineModel<boolean>({ default: false });

const attrs = useAttrs();
const inputAttributes = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attribute]) => attribute !== 'class' && attribute !== 'style'),
  ),
);
</script>

<template>
  <label
    :class="[
      $style.checkbox,
      $style[`size-${size}`],
      $attrs.class,
      { [$style.isDisabled]: disabled },
    ]"
    :style="$attrs.style"
  >
    <input
      v-model="modelValue"
      v-bind="inputAttributes"
      :class="$style.nativeInput"
      :disabled="disabled"
      type="checkbox"
    />

    <span :class="$style.control">
      <SvgIcon
        :class="$style.checkIcon"
        name="check"
      />
    </span>

    <span
      v-if="$slots.default"
      :class="$style.label"
    >
      <slot />
    </span>
  </label>
</template>

<style lang="scss" module>
.checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--color-text-primary);
  cursor: pointer;
  user-select: none;
}

.nativeInput {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.control {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border: 1px solid var(--color-border-secondary);
  border-radius: 5px;
  background: var(--color-surface-base);
  color: var(--color-text-inverse);
  transition:
    background-color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
}

.checkIcon {
  width: calc(var(--checkbox-size) - 4px);
  height: calc(var(--checkbox-size) - 4px);
  opacity: 0;
  transition: opacity 0.2s;
}

.nativeInput:checked + .control {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.nativeInput:checked + .control .checkIcon {
  opacity: 1;
}

.nativeInput:focus-visible + .control {
  border-color: var(--color-primary);
  box-shadow: var(--input-shadow-primary);
}

.checkbox:hover:not(.isDisabled) .control {
  border-color: var(--color-primary-hover);
}

.isDisabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.isDisabled .control {
  border-color: var(--color-border-secondary);
  background: var(--color-surface-disabled);
  color: var(--color-text-disabled);
}

.isDisabled .nativeInput:checked + .control {
  border-color: var(--color-primary-disabled);
  background: var(--color-primary-disabled);
  color: var(--color-text-inverse);
}

.size-md {
  --checkbox-size: 18px;

  font-size: 14px;
  line-height: 20px;
}

.size-lg {
  --checkbox-size: 22px;

  font-size: 16px;
  line-height: 24px;
}

.label {
  min-width: 0;
}
</style>
