<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue';
import type { TIconName, TInputAppearance, TSize } from '@ui/types';
import { computed, ref, useAttrs, useTemplateRef } from 'vue';
import { SvgIcon, UiButtonBase } from '@ui/primitives';

defineOptions({ inheritAttrs: false });

const {
  appearance = 'default',
  clearable = true,
  disabled = false,
  iconLeft,
  placeholder,
  size = 'md',
  type = 'text',
} = defineProps<Props>();

const emit = defineEmits<{
  blur: [event: FocusEvent];
  clear: [];
  focus: [event: FocusEvent];
}>();

interface Props {
  appearance?: TInputAppearance;
  clearable?: boolean;
  disabled?: boolean;
  iconLeft?: TIconName;
  placeholder?: string;
  size?: Exclude<TSize, 'sm'>;
  type?: InputHTMLAttributes['type'];
}

const modelValue = defineModel<string>({ default: '' });

const attrs = useAttrs();
const inputRef = useTemplateRef<HTMLInputElement>('inputRef');
const isFocused = ref(false);

const inputAttributes = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attribute]) => attribute !== 'class' && attribute !== 'style'),
  ),
);

const isReadonly = computed(
  () => attrs.readonly !== undefined && attrs.readonly !== false && attrs.readonly !== 'false',
);
const isClearButtonVisible = computed(
  () => clearable && Boolean(modelValue.value) && !disabled && !isReadonly.value,
);

function clearValue() {
  modelValue.value = '';
  emit('clear');
  inputRef.value?.focus();
}

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit('blur', event);
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit('focus', event);
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  select: () => inputRef.value?.select(),
});
</script>

<template>
  <div
    :class="[
      $style.container,
      $style[`size-${size}`],
      $style[`appearance-${appearance}`],
      $attrs.class,
      {
        [$style.isDisabled]: disabled,
        [$style.isFocused]: isFocused,
      },
    ]"
    :style="$attrs.style"
  >
    <SvgIcon
      v-if="iconLeft"
      :class="$style.iconLeft"
      :name="iconLeft"
    />

    <span
      v-if="$slots.prepend"
      :class="$style.addon"
    >
      <slot name="prepend" />
    </span>

    <input
      ref="inputRef"
      v-model="modelValue"
      v-bind="inputAttributes"
      :aria-invalid="appearance === 'error' || undefined"
      :class="$style.input"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <span
      v-if="$slots.append"
      :class="$style.addon"
    >
      <slot name="append" />
    </span>

    <UiButtonBase
      v-if="isClearButtonVisible"
      aria-label="Очистить поле"
      :class="$style.clearButton"
      @click="clearValue"
      @mousedown.prevent
    >
      <SvgIcon
        :class="$style.clearIcon"
        name="close"
      />
    </UiButtonBase>
  </div>
</template>

<style lang="scss" module>
.container {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid var(--input-border);
  border-radius: 12px;
  background: var(--color-surface-base);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover:not(.isDisabled, .isFocused) {
    border-color: var(--input-hover-border);
  }
}

.appearance-default {
  --input-border: var(--color-border-secondary);
  --input-focus-shadow: var(--input-shadow-primary);
  --input-hover-border: var(--color-primary-disabled);
}

.appearance-error {
  --input-border: var(--color-error);
  --input-focus-shadow: var(--input-shadow-error);
  --input-hover-border: var(--color-error-hover);
}

.isFocused:not(.isDisabled) {
  border-color: var(--input-hover-border);
  box-shadow: var(--input-focus-shadow);
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

.input {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text-primary);
  font: inherit;
  caret-color: var(--color-primary);

  &::placeholder {
    color: var(--color-text-disabled);
  }

  &:disabled {
    color: var(--color-text-disabled);
    cursor: not-allowed;
  }
}

.size-md .input {
  font-size: 16px;
}

.size-lg .input {
  font-size: 18px;
}

.iconLeft,
.clearIcon {
  width: 18px;
  height: 18px;
}

.iconLeft,
.addon {
  flex: 0 0 auto;
  color: var(--color-text-secondary);
}

.isDisabled .iconLeft,
.isDisabled .addon {
  color: var(--color-text-disabled);
}

.clearButton {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;

  &:hover {
    color: var(--color-primary-hover);
  }
}
</style>
