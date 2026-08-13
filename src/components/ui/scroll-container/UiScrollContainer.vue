<script setup lang="ts">
import { useTemplateRef } from 'vue';

const element = useTemplateRef<HTMLElement>('element');

function getScrollElement() {
  return element.value;
}

defineExpose({ getScrollElement });
</script>

<template>
  <div
    ref="element"
    :class="$style.container"
  >
    <slot />
  </div>
</template>

<style module>
.container {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--color-border-secondary);
  border-radius: 32px;
  background: var(--color-surface-page);
  scrollbar-gutter: stable;
}

@media (max-width: 640px) {
  .container {
    border-radius: 20px;
    padding: 10px;
  }
}
</style>
