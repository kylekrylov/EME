<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue';
import { UiButtonIcon } from '@ui/button-icon';
import { DEFAULT_MODAL_WIDTH_PX, FOCUSABLE_ELEMENT_SELECTOR } from '@ui/modals/constants';

interface Props {
  ariaLabel?: string;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  width?: number | string;
}

const {
  ariaLabel = 'Модальное окно',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  width = DEFAULT_MODAL_WIDTH_PX,
} = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const isOpen = defineModel<boolean>('isOpen', { required: true });

const modalElement = ref<HTMLElement>();
const titleId = useId();

let previouslyFocusedElement: HTMLElement | null = null;
let previousBodyOverflow = '';
let isBodyScrollLocked = false;

const modalStyles = computed<CSSProperties>(() => ({
  width: typeof width === 'number' ? `${width}px` : width,
}));

function closeModal() {
  isOpen.value = false;
  emit('close');
}

function onOverlayClick() {
  if (closeOnOverlayClick) {
    closeModal();
  }
}

function getFocusableElements() {
  if (!modalElement.value) {
    return [];
  }

  return [...modalElement.value.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTOR)].filter(
    isElementVisible,
  );
}

function isElementVisible(element: HTMLElement) {
  return element.getClientRects().length > 0;
}

function onModalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && closeOnEscape) {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = getFocusableElements();
  const firstElement = focusableElements.at(0);
  const lastElement = focusableElements.at(-1);

  if (!firstElement || !lastElement) {
    event.preventDefault();
    modalElement.value?.focus();
    return;
  }

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

function lockBodyScroll() {
  if (isBodyScrollLocked) {
    return;
  }

  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  isBodyScrollLocked = true;
}

function restoreModalState() {
  if (isBodyScrollLocked) {
    document.body.style.overflow = previousBodyOverflow;
    isBodyScrollLocked = false;
  }

  previouslyFocusedElement?.focus();
  previouslyFocusedElement = null;
}

watch(
  () => isOpen.value,
  async (isModalOpen) => {
    if (!isModalOpen) {
      restoreModalState();
      return;
    }

    const activeElement = document.activeElement;
    previouslyFocusedElement = activeElement instanceof HTMLElement ? activeElement : null;

    lockBodyScroll();
    await nextTick();

    const [firstFocusableElement] = getFocusableElements();
    (firstFocusableElement ?? modalElement.value)?.focus();
  },
  { flush: 'post', immediate: true },
);

onBeforeUnmount(restoreModalState);
</script>

<template>
  <Teleport to="body">
    <Transition
      :enter-active-class="$style.transitionEnterActive"
      :enter-from-class="$style.transitionEnterFrom"
      :leave-active-class="$style.transitionLeaveActive"
      :leave-to-class="$style.transitionLeaveTo"
    >
      <div
        v-if="isOpen"
        :class="$style.overlay"
        @click.self="onOverlayClick"
      >
        <div
          ref="modalElement"
          :aria-label="$slots.header ? undefined : ariaLabel"
          aria-modal="true"
          :aria-labelledby="$slots.header ? titleId : undefined"
          :class="$style.modal"
          role="dialog"
          :style="modalStyles"
          tabindex="-1"
          @keydown="onModalKeydown"
        >
          <UiButtonIcon
            appearance="clean"
            :class="$style.closeButton"
            icon="close"
            label="Закрыть модальное окно"
            @click="closeModal"
          />

          <div
            v-if="$slots.header"
            :id="titleId"
            :class="$style.header"
          >
            <slot name="header" />
          </div>

          <div :class="$style.content">
            <slot />
          </div>

          <div
            v-if="$slots.footer"
            :class="$style.footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style module>
.overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: var(--color-overlay);
}

.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: var(--color-surface-base);
  box-shadow: var(--shadow);
}

.closeButton {
  position: absolute;
  z-index: 1;
  top: 8px;
  right: 8px;
}

.header {
  padding: 20px 56px 16px 24px;
  border-bottom: 1px solid var(--color-border-secondary);
}

.content {
  min-height: 0;
  padding: 24px;
  overflow-y: auto;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 24px 24px;
}

.transitionEnterActive,
.transitionLeaveActive {
  transition: opacity 0.2s ease-in-out;
}

.transitionEnterActive .modal,
.transitionLeaveActive .modal {
  transition: transform 0.2s ease-in-out;
}

.transitionEnterFrom,
.transitionLeaveTo {
  opacity: 0;
}

.transitionEnterFrom .modal,
.transitionLeaveTo .modal {
  transform: translateY(-20px) scale(0.98);
}
</style>
