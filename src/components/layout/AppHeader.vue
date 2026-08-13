<script setup lang="ts">
import { APP_PAGES, APP_ROUTES } from '@/constants';

const navigationItems = [
  {
    routeName: APP_ROUTES.HOME.name,
    title: 'Главная',
  },
  ...APP_PAGES,
];
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.content">
      <RouterLink
        :class="$style.logo"
        :to="{ name: APP_ROUTES.HOME.name }"
      >
        ЕМЕ
      </RouterLink>

      <nav
        aria-label="Навигация по заданиям"
        :class="$style.navigation"
      >
        <RouterLink
          v-for="{ routeName, title } in navigationItems"
          :key="routeName"
          :class="$style.navigationLink"
          exact-active-class="is-active"
          :to="{ name: routeName }"
        >
          {{ title }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" module>
.header {
  flex: 0 0 auto;
  min-width: 0;
  border-bottom: 1px solid var(--color-border-secondary);
  background: var(--color-surface-base);
}

.content {
  display: flex;
  align-items: center;
  gap: 32px;
  width: min(100% - 40px, 1200px);
  min-height: 64px;
  margin: 0 auto;
}

.logo {
  color: var(--color-primary);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-decoration: none;
}

.navigation {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.navigationLink {
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 20px;
  text-decoration: none;
  white-space: nowrap;

  &:global(.is-active) {
    color: var(--color-primary);
  }

  &:hover {
    color: var(--color-primary-hover);
  }
}
</style>
