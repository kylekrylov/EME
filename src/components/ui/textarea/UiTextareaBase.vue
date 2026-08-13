<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';

interface Props {
  autofocus?: boolean;
  autosize?: boolean;
  disabled?: boolean;
  maxHeight?: number;
  minHeight?: number;
  placeholder?: string;
  rows?: number;
}

const {
  autofocus = false,
  autosize = true,
  disabled = false,
  maxHeight,
  minHeight,
  placeholder = '',
  rows = 3,
} = defineProps<Props>();

const emit = defineEmits<{
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const modelValue = defineModel<string>({ default: '' });

const textareaRef = useTemplateRef<HTMLTextAreaElement>('textareaRef');
const height = ref<string>();
const isScrollable = ref(false);

const textareaStyles = computed<CSSProperties>(() => ({
  height: height.value,
  minHeight: minHeight ? `${minHeight}px` : undefined,
  maxHeight: maxHeight ? `${maxHeight}px` : undefined,
  overflowY: isScrollable.value ? 'auto' : 'hidden',
  resize: autosize ? 'none' : 'vertical',
}));

async function resize() {
  if (!autosize || !textareaRef.value) {
    return;
  }

  height.value = 'auto';
  await nextTick();

  if (!textareaRef.value) {
    return;
  }

  const contentHeight = Math.max(textareaRef.value.scrollHeight + 1, minHeight ?? 0);
  const nextHeight = maxHeight ? Math.min(contentHeight, maxHeight) : contentHeight;

  height.value = `${nextHeight}px`;
  isScrollable.value = Boolean(maxHeight && contentHeight > maxHeight);
}

watch(modelValue, resize, { flush: 'post' });
watch([() => autosize, () => maxHeight, () => minHeight], resize, { flush: 'post' });

onMounted(async () => {
  await resize();

  if (autofocus) {
    textareaRef.value?.focus();
  }
});

defineExpose({
  focus: () => textareaRef.value?.focus(),
  select: () => textareaRef.value?.select(),
});
</script>

<template>
  <textarea
    ref="textareaRef"
    v-model="modelValue"
    :autofocus="autofocus"
    :class="$style.textarea"
    :disabled="disabled"
    :placeholder="placeholder"
    :rows="rows"
    :style="textareaStyles"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
  />
</template>

<style module>
.textarea {
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text-primary);
  font: inherit;
  line-height: 24px;
  caret-color: var(--color-primary);
}

.textarea::placeholder {
  color: var(--color-text-disabled);
}

.textarea:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
</style>
