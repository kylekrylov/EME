<script setup lang="ts">
import type { TInputAppearance } from '@ui/types';

import { computed, ref, useAttrs, useTemplateRef } from 'vue';

import { UiTextareaBase } from '@ui/primitives';

interface Props {
  appearance?: TInputAppearance;
  autofocus?: boolean;
  autosize?: boolean;
  disabled?: boolean;
  maxHeight?: number;
  minHeight?: number;
  placeholder?: string;
  rows?: number;
}

defineOptions({ inheritAttrs: false });

const {
  appearance = 'default',
  autofocus = false,
  autosize = true,
  disabled = false,
  maxHeight = 320,
  minHeight = 112,
  placeholder = 'Введите сообщение...',
  rows = 3,
} = defineProps<Props>();

const emit = defineEmits<{
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const modelValue = defineModel<string>({ default: '' });

const attrs = useAttrs();
const textareaRef = useTemplateRef<InstanceType<typeof UiTextareaBase>>('textareaRef');
const isFocused = ref(false);

const textareaAttributes = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attribute]) => attribute !== 'class' && attribute !== 'style'),
  ),
);

function handleBlur(event: FocusEvent) {
  isFocused.value = false;
  emit('blur', event);
}

function handleFocus(event: FocusEvent) {
  isFocused.value = true;
  emit('focus', event);
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  select: () => textareaRef.value?.select(),
});
</script>

<template>
  <div
    :class="[
      $style.container,
      $style[`appearance-${appearance}`],
      $attrs.class,
      {
        [$style.isDisabled]: disabled,
        [$style.isFocused]: isFocused,
      },
    ]"
    :style="$attrs.style"
  >
    <UiTextareaBase
      ref="textareaRef"
      v-model="modelValue"
      v-bind="textareaAttributes"
      :aria-invalid="appearance === 'error' || undefined"
      :autofocus="autofocus"
      :autosize="autosize"
      :class="$style.textarea"
      :disabled="disabled"
      :max-height="maxHeight"
      :min-height="minHeight"
      :placeholder="placeholder"
      :rows="rows"
      @blur="handleBlur"
      @focus="handleFocus"
    />
  </div>
</template>

<style module>
.container {
  width: 100%;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--textarea-border);
  border-radius: 12px;
  background: var(--color-surface-base);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.container:hover:not(.isDisabled, .isFocused) {
  border-color: var(--textarea-hover-border);
}

.appearance-default {
  --textarea-border: var(--color-border-secondary);
  --textarea-focus-shadow: var(--input-shadow-primary);
  --textarea-hover-border: var(--color-primary-disabled);
}

.appearance-error {
  --textarea-border: var(--color-error);
  --textarea-focus-shadow: var(--input-shadow-error);
  --textarea-hover-border: var(--color-error-hover);
}

.isFocused:not(.isDisabled) {
  border-color: var(--textarea-hover-border);
  box-shadow: var(--textarea-focus-shadow);
}

.isDisabled {
  border-color: var(--color-surface-disabled);
  background: var(--color-surface-disabled);
  cursor: not-allowed;
}

.textarea {
  display: block;
}
</style>
