<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
</script>

<template>
  <div :class="$style.layout">
    <AppHeader />

    <main :class="$style.main">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" module>
.layout {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: min(100% - 40px, 1200px);
  min-height: 0;
  margin: 0 auto;
  padding: 48px 0 80px;
  overflow-y: auto;
}
</style>
