<script setup lang="ts">
import type { IUiButtonProps, TIconName, TSize } from '@ui/types';
import { computed, useCssModule } from 'vue';
import { SvgIcon, UiButtonBase } from '@ui/primitives';

interface Props extends IUiButtonProps {
  colorIcon?: string;
  icon: TIconName;
  label: string;
  size?: TSize;
}

const {
  active,
  appearance = 'clean',
  colorIcon,
  disabled,
  icon,
  label,
  size = 'md',
  type,
} = defineProps<Props>();

const styles = useCssModule();

const classes = computed(() => [styles.button, styles[`size-${size}`]]);
</script>

<template>
  <UiButtonBase
    :aria-label="label"
    :class="classes"
    :data-active="active || undefined"
    :data-appearance="appearance"
    :disabled="disabled"
    :type="type"
  >
    <SvgIcon
      :class="$style.icon"
      :color="colorIcon"
      :name="icon"
    />
  </UiButtonBase>
</template>

<style lang="scss" module>
@use '../button/appearances';

.button {
  @include appearances.interactions;
  @include appearances.variants;

  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
}

.icon {
  transition: color 0.2s;
}

.size-sm {
  width: 28px;
  height: 28px;
}

.size-sm .icon {
  width: 16px;
  height: 16px;
}

.size-md {
  width: 40px;
  height: 40px;
}

.size-md .icon {
  width: 20px;
  height: 20px;
}

.size-lg {
  width: 52px;
  height: 52px;
}

.size-lg .icon {
  width: 24px;
  height: 24px;
}
</style>
