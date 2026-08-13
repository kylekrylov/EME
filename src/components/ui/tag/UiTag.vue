<script setup lang="ts">
import type { TUiTagColor } from './types';
import type { TSize } from '@ui/types';

interface Props {
  color?: TUiTagColor;
  disabled?: boolean;
  size?: TSize;
}

const { color = 'neutral', disabled = false, size = 'md' } = defineProps<Props>();
</script>

<template>
  <span
    :class="[
      $style.tag,
      $style[`color-${color}`],
      $style[`size-${size}`],
      { [$style.isDisabled]: disabled },
    ]"
  >
    <slot />
  </span>
</template>

<style module>
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  border: 1px solid color-mix(in srgb, var(--tag-color) 34%, transparent);
  border-radius: 999px;
  background: var(--tag-background);
  color: var(--tag-color);
  font-weight: 700;
  white-space: nowrap;
}

.size-sm {
  min-height: 22px;
  padding: 1px 8px;
  font-size: 12px;
  line-height: 18px;
}

.size-md {
  min-height: 28px;
  padding: 3px 10px;
  font-size: 13px;
  line-height: 20px;
}

.size-lg {
  min-height: 34px;
  padding: 5px 12px;
  font-size: 14px;
  line-height: 22px;
}

.color-neutral {
  --tag-background: var(--color-surface-secondary);
  --tag-color: var(--color-text-secondary);
}

.color-primary {
  --tag-background: var(--color-surface-primary-soft);
  --tag-color: var(--color-primary-active);
}

.color-info {
  --tag-background: var(--color-info-soft);
  --tag-color: var(--color-info);
}

.color-success {
  --tag-background: var(--color-success-soft);
  --tag-color: var(--color-success);
}

.color-warning {
  --tag-background: var(--color-warning-soft);
  --tag-color: var(--color-warning);
}

.color-error {
  --tag-background: var(--color-error-soft);
  --tag-color: var(--color-error);
}

.isDisabled {
  opacity: 0.5;
}
</style>
