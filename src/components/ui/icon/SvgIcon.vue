<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { TIconName } from '@ui/types';
import { computed } from 'vue';
import { icons } from '@ui/icon/icons';

interface Props {
  color?: string;
  externalSvgContent?: string;
  name?: TIconName;
  size?: number | string;
}

const { color, externalSvgContent = '', name, size } = defineProps<Props>();

const normalizedSize = computed(() => (typeof size === 'number' ? `${size}px` : size));

const styles = computed<CSSProperties>(() => ({
  ...(normalizedSize.value && {
    height: normalizedSize.value,
    width: normalizedSize.value,
  }),
  ...(color && { color }),
}));

const svgContent = computed(() => {
  if (externalSvgContent) {
    return externalSvgContent;
  }

  if (!name) {
    return '';
  }

  const icon = icons[name];
  return icon;
});
</script>

<template>
  <span
    aria-hidden="true"
    :class="$style.svg"
    :style="styles"
    v-html="svgContent"
  />
</template>

<style module>
.svg {
  display: inline-flex;
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  color: inherit;
}

.svg > svg {
  width: 100%;
  height: 100%;
}
</style>
