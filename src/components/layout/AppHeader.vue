<script setup lang="ts">
import { NAVIGATION_PAGES, PAGE_DEFINITIONS } from '@/constants';
</script>

<template>
  <header :class="$style.header">
    <div :class="$style.content">
      <RouterLink
        :class="$style.logo"
        :to="{ name: PAGE_DEFINITIONS.HOME.name }"
      >
        ЕМЕ
      </RouterLink>

      <nav
        aria-label="Навигация по заданиям"
        :class="$style.navigation"
      >
        <RouterLink
          v-for="{ name, title } in NAVIGATION_PAGES"
          :key="name"
          :class="$style.navigationLink"
          exact-active-class="is-active"
          :to="{ name }"
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
