<script setup lang="ts">
import type { TSize } from '@ui/types';

interface Props {
  inverted?: boolean;
  size?: TSize;
}

const { inverted = false, size = 'md' } = defineProps<Props>();
</script>

<template>
  <div
    aria-hidden="true"
    :class="[$style.loader, $style[size], { [$style.inverted]: inverted }]"
  />
</template>

<style module>
.loader {
  --loader-color: var(--color-icon-primary);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--size);
  height: var(--size);

  &:before,
  &:after {
    position: absolute;
    border-radius: 50%;
    content: '';
  }

  &:after {
    inset: 0;
    border: var(--border-size-after) solid transparent;
    border-top-color: var(--loader-color);
    border-right-color: var(--loader-color);
    animation: spin 1.5s linear infinite;
  }

  &:before {
    inset: var(--inset-before);
    border: var(--border-size-before) solid transparent;
    border-top-color: var(--loader-color);
    border-right-color: var(--loader-color);
    animation: spin-reverse 2s linear infinite;
  }
}

.inverted {
  --loader-color: var(--color-icon-inverse);
}

@keyframes spin {
  0% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(315deg);
  }
}

@keyframes spin-reverse {
  0% {
    transform: rotate(45deg);
  }

  100% {
    transform: rotate(-315deg);
  }
}

.sm {
  --size: 20px;
  --inset-before: 5px;
  --border-size-after: 2px;
  --border-size-before: 1px;
}

.md {
  --size: 24px;
  --inset-before: 5px;
  --border-size-after: 2.4px;
  --border-size-before: 1.2px;
}

.lg {
  --size: 28px;
  --inset-before: 6px;
  --border-size-after: 2.8px;
  --border-size-before: 1.4px;
}
</style>
