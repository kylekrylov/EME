<script setup lang="ts">
import PageHeader from '@/components/layout/PageHeader.vue';
import { APP_PAGES } from '@/constants';
import { UiScrollContainer } from '@ui';

const TECH_STACK = [
  {
    description: 'Компонентная основа приложения со строгой типизацией данных и интерфейсов.',
    title: 'Vue 3 + TypeScript',
  },
  {
    description: 'Dev-сервер и production-сборка с публикацией проекта на GitHub Pages.',
    title: 'Vite',
  },
  {
    description: 'Маршрутизация самостоятельных страниц и синхронизация состояния с URL.',
    title: 'Vue Router',
  },
  {
    description: 'Общее состояние страниц, черновиков, данных таблицы и списка задач.',
    title: 'Pinia',
  },
  {
    description: 'CSS Modules, дизайн-токены и локальные стили компонентов.',
    title: 'SCSS',
  },
  {
    description: 'Декларативная валидация полей и управление состоянием формы.',
    title: 'VeeValidate',
  },
  {
    description: 'Расширяемая основа для сценариев с форматируемым текстом.',
    title: 'Tiptap',
  },
  {
    description: 'Единые правила качества и форматирования на основе antfu/eslint-config.',
    title: 'ESLint + Prettier',
  },
] as const;
</script>

<template>
  <div :class="$style.page">
    <PageHeader>
      <template #title>
        Тестовые задания Frontend-разработчика
      </template>
      <template #requirements>
        SPA из шести самостоятельных интерфейсных задач, каждая из которых оформлена на отдельной
        странице.
      </template>
      <template #implementation>
        Общая архитектура, переиспользуемые UI-компоненты, типизированные данные и единые
        дизайн-токены.
      </template>
    </PageHeader>

    <UiScrollContainer :class="$style.container">
      <section aria-labelledby="pages-heading">
        <div :class="$style.sectionHeader">
          <div>
            <p :class="$style.eyebrow">6 заданий</p>
            <h2
              id="pages-heading"
              :class="$style.sectionTitle"
            >
              Страницы проекта
            </h2>
          </div>
          <p :class="$style.sectionDescription">
            Все задания используют общую UI-библиотеку, но сохраняют собственную предметную логику.
          </p>
        </div>

        <ol :class="$style.pages">
          <li
            v-for="({ description, routeName, title }, index) in APP_PAGES"
            :key="routeName"
          >
            <RouterLink
              :class="$style.pageCard"
              :to="{ name: routeName }"
            >
              <span :class="$style.pageNumber">{{ String(index + 1).padStart(2, '0') }}</span>
              <h3 :class="$style.pageTitle">{{ title }}</h3>
              <p :class="$style.pageDescription">{{ description }}</p>
              <span :class="$style.pageAction">
                Открыть страницу
                <span aria-hidden="true">→</span>
              </span>
            </RouterLink>
          </li>
        </ol>
      </section>

      <section aria-labelledby="stack-heading">
        <div :class="$style.sectionHeader">
          <div>
            <p :class="$style.eyebrow">Технологии</p>
            <h2
              id="stack-heading"
              :class="$style.sectionTitle"
            >
              Общий стек
            </h2>
          </div>
          <p :class="$style.sectionDescription">
            Инструменты подобраны для типобезопасной разработки, переиспользования компонентов и
            предсказуемого качества кода.
          </p>
        </div>

        <dl :class="$style.stack">
          <div
            v-for="technology in TECH_STACK"
            :key="technology.title"
            :class="$style.stackItem"
          >
            <dt :class="$style.stackTitle">{{ technology.title }}</dt>
            <dd :class="$style.stackDescription">{{ technology.description }}</dd>
          </div>
        </dl>
      </section>
    </UiScrollContainer>
  </div>
</template>

<style lang="scss" module>
.page {
  width: 100%;
  padding-bottom: 24px;
}

.container {
  margin-top: 48px;
  padding: 24px;
}

.sectionHeader {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(280px, 1.2fr);
  align-items: end;
  gap: 32px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary-active);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 20px;
  text-transform: uppercase;
}

.sectionTitle {
  margin: 0;
  font-size: 24px;
  line-height: 32px;
}

.sectionDescription {
  max-width: 620px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 22px;
}

.pages {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pageCard {
  display: flex;
  flex-direction: column;
  min-height: 240px;
  padding: 24px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 16px;
  background: var(--color-surface-base);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-surface-primary-soft);
    transform: translateY(-2px);
  }
}

.pageNumber {
  color: var(--color-primary-active);
  font-size: 13px;
  font-weight: 800;
  line-height: 20px;
}

.pageTitle {
  margin: 28px 0 8px;
  font-size: 19px;
  line-height: 26px;
}

.pageDescription {
  margin: 0 0 24px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 21px;
}

.pageAction {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  color: var(--color-primary-active);
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
}

.stack {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.stackItem {
  padding: 20px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 12px;
  background: var(--color-surface-base);
}

.stackTitle {
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 800;
  line-height: 22px;
}

.stackDescription {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 20px;
}

@media (max-width: 980px) {
  .pages {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stack {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .section {
    margin-top: 36px;
  }

  .container {
    padding: 16px;
  }

  .sectionHeader {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .pages,
  .stack {
    grid-template-columns: 1fr;
  }

  .pageCard {
    min-height: 220px;
  }
}
</style>
