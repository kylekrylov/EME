<script setup lang="ts">
import type { IUiButtonBaseProps } from '@ui/types';

import { useTemplateRef } from 'vue';

const { disabled = false, type = 'button' } = defineProps<IUiButtonBaseProps>();

const element = useTemplateRef<HTMLButtonElement>('element');

function getElement() {
  return element.value;
}

defineExpose({ getElement });
</script>

<template>
  <button
    ref="element"
    :class="$style.button"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<style module>
:where(.button) {
  margin: 0;
  padding: 0;
  border: 0;
  appearance: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: inherit;
}

:where(.button:disabled) {
  cursor: not-allowed;
}
</style>
