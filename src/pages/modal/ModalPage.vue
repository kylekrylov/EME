<script setup lang="ts">
import { ref } from 'vue';

import PageHeader from '@/components/layout/PageHeader.vue';
import { UiButton, UiModal } from '@ui';

const APPLY_DELAY_MS = 1000;

const isApplying = ref(false);
const isModalOpen = ref(false);
const isApplied = ref(false);

function openModal() {
  isApplied.value = false;
  isModalOpen.value = true;
}

function cancelModal() {
  isModalOpen.value = false;
}

async function applyChanges() {
  isApplying.value = true;

  await new Promise<void>((resolve) => {
    setTimeout(resolve, APPLY_DELAY_MS);
  });

  isApplying.value = false;
  isModalOpen.value = false;
  isApplied.value = true;
}
</script>

<template>
  <section :class="$style.page">
    <PageHeader>
      <template #title>Модальное окно</template>
      <template #requirements>
        Диалог с текстом, действиями отмены и применения, загрузкой перед закрытием.
      </template>
      <template #implementation>
        UiModal использует Teleport, focus trap, блокировку страницы и закрытие по Escape или
        оверлею.
      </template>
    </PageHeader>

    <UiButton
      :class="$style.openButton"
      type="button"
      @click="openModal"
    >
      Открыть модальное окно
    </UiButton>

    <p
      v-if="isApplied"
      :class="$style.status"
      role="status"
    >
      Изменения успешно применены.
    </p>

    <UiModal v-model:is-open="isModalOpen">
      <template #header>
        <h2 :class="$style.modalTitle">Подтверждение действия</h2>
      </template>

      <p :class="$style.modalText">
        Применить выбранные настройки? После подтверждения изменения вступят в силу.
      </p>

      <template #footer>
        <UiButton
          appearance="secondary"
          :disabled="isApplying"
          type="button"
          @click="cancelModal"
        >
          Отменить
        </UiButton>
        <UiButton
          :loading="isApplying"
          type="button"
          @click="applyChanges"
        >
          Применить
        </UiButton>
      </template>
    </UiModal>
  </section>
</template>

<style lang="scss" module>
.page {
  max-width: 720px;
}

.openButton {
  margin-top: 24px;
}

.status {
  margin: 16px 0 0;
  color: var(--color-primary-active);
  font-size: 14px;
  line-height: 20px;
}

.modalTitle {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 20px;
  line-height: 28px;
}

.modalText {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 24px;
}
</style>
