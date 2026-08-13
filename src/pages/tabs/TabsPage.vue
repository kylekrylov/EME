<script setup lang="ts">
import { computed } from 'vue';

import PageHeader from '@/components/layout/PageHeader.vue';
import { UiTabs, UiTabsContent } from '@ui';

import { useTabsPage } from './composables/useTabsPage';
import { TABS_PAGE_ITEMS } from './constants';

const { activeTab, direction, tabsId } = useTabsPage();

const activeContent = computed(() => {
  if (activeTab.value === 'features') {
    return {
      eyebrow: 'Возможности',
      text: 'Компонент управляется через v-model, поддерживает любое количество вкладок и умеет пропускать отключённые пункты.',
      title: 'Простой API для разных сценариев',
    };
  }

  if (activeTab.value === 'accessibility') {
    return {
      eyebrow: 'Доступность',
      text: 'Стрелки переключают вкладки, Home и End переходят к краям списка, а роли tablist, tab и tabpanel связывают интерфейс для скринридеров.',
      title: 'Управление без мыши',
    };
  }

  return {
    eyebrow: 'Описание',
    text: 'Активная вкладка сохраняется в query-параметре URL, поэтому выбранный раздел можно открыть напрямую или отправить ссылкой.',
    title: 'Вкладки с сохранением состояния',
  };
});
</script>

<template>
  <section :class="$style.page">
    <PageHeader>
      <template #title>Табы</template>
      <template #requirements>
        Вкладки с активным состоянием, анимацией контента и синхронизацией с URL.
      </template>
      <template #implementation>
        UiTabs обеспечивает доступную навигацию, UiTabsContent — направленное смещение панелей.
      </template>
    </PageHeader>

    <div :class="$style.demo">
      <UiTabs
        :id="tabsId"
        v-model="activeTab"
        aria-label="Разделы компонента вкладок"
        full-width
        :items="TABS_PAGE_ITEMS"
      />

      <UiTabsContent
        :active-value="activeTab"
        :class="$style.content"
        :direction="direction"
        :tabs-id="tabsId"
      >
        <article :class="$style.card">
          <p :class="$style.cardEyebrow">{{ activeContent.eyebrow }}</p>
          <h2 :class="$style.cardTitle">{{ activeContent.title }}</h2>
          <p :class="$style.cardText">{{ activeContent.text }}</p>
        </article>
      </UiTabsContent>
    </div>
  </section>
</template>

<style lang="scss" module>
.page {
  width: 100%;
  max-width: 820px;
}

.demo {
  margin-top: 28px;
  overflow: hidden;
  border: 1px solid var(--color-border-secondary);
  border-radius: 20px;
  background: var(--color-surface-base);
}

.content {
  min-height: 300px;
}

.card {
  min-height: 300px;
  padding: 48px;
  background:
    radial-gradient(circle at 90% 10%, var(--color-surface-primary-soft), transparent 42%),
    var(--color-surface-base);
}

.cardEyebrow {
  margin: 0;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-transform: uppercase;
}

.cardTitle {
  max-width: 520px;
  margin: 14px 0 0;
  color: var(--color-text-primary);
  font-size: 28px;
  line-height: 36px;
}

.cardText {
  max-width: 600px;
  margin: 16px 0 0;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 26px;
}

@media (max-width: 600px) {
  .card {
    min-height: 340px;
    padding: 32px 24px;
  }
}
</style>
