<script setup lang="ts">
import { UiSkeleton } from '@ui';
</script>

<template>
  <article
    aria-hidden="true"
    :class="$style.skeleton"
  >
    <div :class="$style.meta">
      <UiSkeleton :class="$style.postId" />
      <UiSkeleton :class="$style.userId" />
    </div>

    <div :class="$style.content">
      <UiSkeleton :class="$style.title" />
      <UiSkeleton :class="$style.titleShort" />

      <div :class="$style.body">
        <UiSkeleton :class="$style.bodyLine" />
        <UiSkeleton :class="$style.bodyLine" />
        <UiSkeleton :class="$style.bodyLineShort" />
      </div>
    </div>

    <span :class="$style.decorativeShape" />
  </article>
</template>

<style lang="scss" module>
.skeleton {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 350px;
  padding: 32px;
  overflow: hidden;
  border: 1px solid var(--color-border-secondary);
  border-radius: 20px;
  background: var(--color-surface-base);
}

.meta {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.postId {
  width: 132px;
  height: 32px;
  border-radius: 999px;
}

.userId {
  width: 176px;
  height: 20px;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  max-width: 720px;
}

.title,
.titleShort {
  height: 28px;
}

.title {
  width: 72%;
}

.titleShort {
  width: 46%;
  margin-top: 8px;
}

.body {
  display: grid;
  gap: 8px;
  margin-top: 24px;
}

.bodyLine,
.bodyLineShort {
  height: 16px;
}

.bodyLine {
  width: 100%;
}

.bodyLineShort {
  width: 64%;
}

.decorativeShape {
  position: absolute;
  right: -28px;
  bottom: -70px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: var(--color-surface-primary-soft);
}

@media (max-width: 640px) {
  .skeleton {
    padding: 24px;
  }

  .userId {
    width: 120px;
  }

  .title {
    width: 88%;
  }
}
</style>
