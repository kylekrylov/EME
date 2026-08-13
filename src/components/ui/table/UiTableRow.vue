<script setup lang="ts">
interface Props {
  disableHover?: boolean;
}

const { disableHover = false } = defineProps<Props>();
</script>

<template>
  <tr :class="[$style.row, { [$style.hasHover]: !disableHover }]">
    <slot />
  </tr>
</template>

<style module>
.row {
  border-bottom: 1px solid var(--color-border-secondary);
  background: var(--color-surface-base);
  transition: background-color 0.2s ease;
}

.row:last-child {
  border-bottom: 0;
}

.row:nth-child(even) {
  background: var(--color-table-row-even);
}

.hasHover:hover {
  background: var(--color-surface-primary-soft);
}
</style>
