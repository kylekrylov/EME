<script setup lang="ts">
import type { IUiTabItem } from './types';

import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';

import { SvgIcon, UiButtonBase } from '@ui/primitives';

interface Props {
  ariaLabel?: string;
  fullWidth?: boolean;
  id?: string;
  items: readonly IUiTabItem[];
}

const { ariaLabel = 'Вкладки', fullWidth = false, id = useId(), items } = defineProps<Props>();

const activeTab = defineModel<string>({ required: true });

const activeLineLeft = ref(0);
const activeLineWidth = ref(0);
const tabElements = new Map<string, HTMLButtonElement>();

let resizeObserver: ResizeObserver | null = null;
let updateFrameId: number | null = null;

function getPanelId(value: string) {
  return `${id}-panel-${value}`;
}

function getTabId(value: string) {
  return `${id}-tab-${value}`;
}

function isActive(value: string) {
  return activeTab.value === value;
}

function selectTab(value: string) {
  const tab = items.find((item) => {
    return item.value === value;
  });

  if (!tab?.disabled) {
    activeTab.value = value;
  }
}

function setTabElement(element: unknown, value: string) {
  const previousElement = tabElements.get(value);

  if (previousElement) {
    resizeObserver?.unobserve(previousElement);
  }

  const buttonElement = getButtonElement(element);

  if (buttonElement) {
    tabElements.set(value, buttonElement);
    resizeObserver?.observe(buttonElement);
  } else {
    tabElements.delete(value);
  }
}

function getButtonElement(element: unknown) {
  if (element instanceof HTMLButtonElement) {
    return element;
  }

  const buttonComponent = element as null | { getElement?: () => HTMLButtonElement | undefined };
  return buttonComponent?.getElement?.();
}

function updateActiveLine() {
  const activeElement = tabElements.get(activeTab.value);

  if (!activeElement) {
    activeLineLeft.value = 0;
    activeLineWidth.value = 0;
    return;
  }

  activeLineLeft.value = activeElement.offsetLeft;
  activeLineWidth.value = activeElement.offsetWidth;
}

function scheduleActiveLineUpdate() {
  if (updateFrameId !== null) {
    cancelAnimationFrame(updateFrameId);
  }

  updateFrameId = requestAnimationFrame(() => {
    updateFrameId = null;
    updateActiveLine();
  });
}

function getNextEnabledIndex(currentIndex: number, direction: 1 | -1) {
  if (!items.length) {
    return -1;
  }

  for (let step = 1; step <= items.length; step += 1) {
    const nextIndex = (currentIndex + direction * step + items.length) % items.length;

    if (!items[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return -1;
}

async function selectAndFocus(index: number) {
  const tab = items[index];

  if (!tab || tab.disabled) {
    return;
  }

  activeTab.value = tab.value;
  await nextTick();
  tabElements.get(tab.value)?.focus();
}

function handleKeydown(event: KeyboardEvent, currentIndex: number) {
  let nextIndex = -1;

  if (event.key === 'ArrowRight') {
    nextIndex = getNextEnabledIndex(currentIndex, 1);
  } else if (event.key === 'ArrowLeft') {
    nextIndex = getNextEnabledIndex(currentIndex, -1);
  } else if (event.key === 'Home') {
    nextIndex = items.findIndex((item) => {
      return !item.disabled;
    });
  } else if (event.key === 'End') {
    const reversedIndex = [...items].reverse().findIndex((item) => {
      return !item.disabled;
    });
    nextIndex = reversedIndex === -1 ? -1 : items.length - reversedIndex - 1;
  }

  if (nextIndex !== -1) {
    event.preventDefault();
    void selectAndFocus(nextIndex);
  }
}

onMounted(() => {
  resizeObserver = new ResizeObserver(scheduleActiveLineUpdate);
  tabElements.forEach((element) => {
    resizeObserver?.observe(element);
  });
  updateActiveLine();
});

watch(
  () => [activeTab.value, items] as const,
  async () => {
    await nextTick();
    updateActiveLine();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  if (updateFrameId !== null) {
    cancelAnimationFrame(updateFrameId);
  }

  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<template>
  <div
    :aria-label="ariaLabel"
    :class="[$style.tabs, { [$style.isFullWidth]: fullWidth }]"
    role="tablist"
  >
    <UiButtonBase
      v-for="(item, index) in items"
      :id="getTabId(item.value)"
      :key="item.value"
      :ref="(element) => setTabElement(element, item.value)"
      :aria-controls="getPanelId(item.value)"
      :aria-selected="isActive(item.value)"
      :class="[$style.tab, { [$style.isActive]: isActive(item.value) }]"
      :disabled="item.disabled"
      role="tab"
      :tabindex="isActive(item.value) ? 0 : -1"
      @click="selectTab(item.value)"
      @keydown="handleKeydown($event, index)"
    >
      <SvgIcon
        v-if="item.iconLeft"
        :class="$style.icon"
        :name="item.iconLeft"
      />
      <slot
        name="before"
        v-bind="item"
      />
      <span>{{ item.title }}</span>
      <slot
        name="after"
        v-bind="item"
      />
      <SvgIcon
        v-if="item.iconRight"
        :class="$style.icon"
        :name="item.iconRight"
      />
    </UiButtonBase>

    <span
      aria-hidden="true"
      :class="$style.activeLine"
      :style="{
        width: `${activeLineWidth}px`,
        transform: `translateX(${activeLineLeft}px)`,
      }"
    />
  </div>
</template>

<style module>
.tabs {
  position: relative;
  display: flex;
  overflow-x: auto;
  width: fit-content;
  max-width: 100%;
  border-bottom: 1px solid var(--color-border-secondary);
  scrollbar-width: none;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.tab:hover:not(:disabled) {
  background: var(--color-surface-primary-soft);
  color: var(--color-primary-hover);
}

.tab.isActive {
  color: var(--color-primary-active);
}

.tab:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.icon {
  width: 16px;
  height: 16px;
}

.activeLine {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--color-primary);
  pointer-events: none;
  transition:
    width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.isFullWidth {
  width: 100%;
}

.isFullWidth .tab {
  flex: 1 1 0;
}

@media (prefers-reduced-motion: reduce) {
  .activeLine {
    transition: none;
  }
}
</style>
