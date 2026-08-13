<script setup lang="ts">
import type { IUiButtonProps, TIconName, TSize } from '@ui/types';
import { computed, useCssModule } from 'vue';
import { SvgIcon, UiButtonBase, UiLoader } from '@ui/primitives';

interface Props extends IUiButtonProps {
  iconLeft?: TIconName;
  iconLeftColor?: string;
  iconRight?: TIconName;
  loading?: boolean;
  size?: TSize;
}

const {
  active,
  appearance = 'primary',
  disabled,
  iconLeft,
  iconLeftColor,
  iconRight,
  loading = false,
  size = 'md',
  type,
} = defineProps<Props>();

const styles = useCssModule();

const classes = computed(() => ({
  [styles.btn]: true,
  [styles.btnLarge]: size === 'lg',
  [styles.btnDefault]: size === 'md',
  [styles.btnSmall]: size === 'sm',
  [styles.isLoading]: loading,
}));
</script>

<template>
  <UiButtonBase
    :aria-busy="loading || undefined"
    :class="classes"
    :data-active="active || undefined"
    :data-appearance="appearance"
    :disabled="disabled || loading"
    :type="type"
  >
    <div :class="styles.container">
      <SvgIcon
        v-if="iconLeft"
        :class="styles.icon"
        :color="iconLeftColor"
        :name="iconLeft"
      />
      <span :class="styles.buttonText">
        <slot />
      </span>
      <SvgIcon
        v-if="iconRight"
        :class="styles.icon"
        :name="iconRight"
      />
    </div>
    <UiLoader
      v-if="loading"
      :class="styles.loader"
      :inverted="appearance === 'primary' || appearance === 'error'"
      :size="size"
    />
  </UiButtonBase>
</template>

<style lang="scss" module>
@use './appearances';

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.btn {
  @include appearances.interactions;
  @include appearances.variants;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  max-width: 100%;
  height: var(--btn-height);
  padding: var(--btn-padding);
  border-radius: 32px;
  font-family: inherit;
  font-size: var(--btn-font-size);
  font-weight: 700;
}

.buttonText {
  width: 100%;
  padding-bottom: 1px;
}

.isLoading .container {
  opacity: 0;
}

.icon {
  flex-shrink: 0;
  width: var(--btn-icon-size);
  height: var(--btn-icon-size);
}

.loader {
  position: absolute;
  color: inherit;
}

.btnLarge {
  --btn-icon-size: 22px;
  --btn-font-size: 18px;
  --btn-height: 47px;
  --btn-padding: 0 20px;
}

.btnDefault {
  --btn-icon-size: 18px;
  --btn-font-size: 16px;
  --btn-height: 37px;
  --btn-padding: 0 16px;
}

.btnSmall {
  --btn-icon-size: 16px;
  --btn-font-size: 14px;
  --btn-height: 31px;
  --btn-padding: 0 12px;
}
</style>
