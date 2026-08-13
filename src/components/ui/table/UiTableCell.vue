<script setup lang="ts">
import type { TUiTableAlign } from './types';

interface Props {
  align?: TUiTableAlign;
  nowrap?: boolean;
}

const { align = 'left', nowrap = true } = defineProps<Props>();
</script>

<template>
  <td :class="[$style.cell, $style[`align-${align}`], { [$style.isNowrap]: nowrap }]">
    <slot />
  </td>
</template>

<style module>
.cell {
  padding: 15px 18px;
  color: var(--color-text-primary);
  font-size: 14px;
  line-height: 20px;
  vertical-align: middle;
}

.isNowrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.align-right {
  text-align: right;
}
</style>
