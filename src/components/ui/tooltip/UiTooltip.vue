<script setup lang="ts">
import type { TSize, TTooltipPlacement } from '@ui/types';
import { onBeforeUnmount, ref, useId } from 'vue';

interface Props {
  content?: string;
  delay?: number;
  placement?: TTooltipPlacement;
  showDelay?: number;
  size?: TSize;
}

const {
  content,
  delay = 100,
  placement = 'top',
  showDelay = 0,
  size = 'sm',
} = defineProps<Props>();

const tooltipId = useId();
const isVisible = ref(false);

let hideTimeout: ReturnType<typeof setTimeout> | null = null;
let showTimeout: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeout = null;
  }
}

function hideTooltip() {
  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeout = null;
  }

  hideTimeout = setTimeout(() => {
    isVisible.value = false;
  }, delay);
}

function showTooltip() {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  showTimeout = setTimeout(() => {
    isVisible.value = true;
  }, showDelay);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    clearTimers();
    isVisible.value = false;
  }
}

onBeforeUnmount(clearTimers);

defineExpose({ isVisible });
</script>

<template>
  <span
    :aria-describedby="tooltipId"
    :class="[$style.wrapper, $style[`placement-${placement}`]]"
    tabindex="0"
    @focusin="showTooltip"
    @focusout="hideTooltip"
    @keydown="handleKeydown"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot
      name="trigger"
      :is-active="isVisible"
    />

    <span
      v-show="isVisible"
      :id="tooltipId"
      :class="[$style.tooltip, $style[`size-${size}`]]"
      role="tooltip"
    >
      <slot name="content">{{ content }}</slot>
    </span>
  </span>
</template>

<style module>
.wrapper {
  position: relative;
  display: inline-flex;
  width: fit-content;
  outline: none;
}

.tooltip {
  position: absolute;
  z-index: 100;
  width: max-content;
  max-width: 244px;
  border-radius: 8px;
  background: var(--color-text-primary);
  box-shadow: var(--shadow);
  color: var(--color-text-inverse);
  pointer-events: none;
}

.tooltip::after {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
  content: '';
  transform: rotate(45deg);
}

.size-sm {
  padding: 4px 8px;
  font-size: 12px;
  line-height: 16px;
}

.size-md {
  padding: 6px 10px;
  font-size: 14px;
  line-height: 18px;
}

.size-lg {
  padding: 8px 12px;
  font-size: 16px;
  line-height: 20px;
}

.placement-top .tooltip {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.placement-top .tooltip::after {
  bottom: -4px;
  left: calc(50% - 4px);
}

.placement-bottom .tooltip {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.placement-bottom .tooltip::after {
  top: -4px;
  left: calc(50% - 4px);
}

.placement-left .tooltip {
  top: 50%;
  right: calc(100% + 8px);
  transform: translateY(-50%);
}

.placement-left .tooltip::after {
  top: calc(50% - 4px);
  right: -4px;
}

.placement-right .tooltip {
  top: 50%;
  left: calc(100% + 8px);
  transform: translateY(-50%);
}

.placement-right .tooltip::after {
  top: calc(50% - 4px);
  left: -4px;
}
</style>
