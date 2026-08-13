<script setup lang="ts">
import type { IPost } from '@/api/posts';

interface Props {
  post: IPost;
}

const { post } = defineProps<Props>();
</script>

<template>
  <article :class="$style.card">
    <div :class="$style.meta">
      <span :class="$style.postId">Публикация #{{ post.id }}</span>
      <span :class="$style.userId">Автор: пользователь #{{ post.userId }}</span>
    </div>

    <div :class="$style.content">
      <h2 :class="$style.title">
        {{ post.title }}
      </h2>
      <p :class="$style.body">
        {{ post.body }}
      </p>
    </div>

    <span
      aria-hidden="true"
      :class="$style.decorativeNumber"
    >
      {{ post.id }}
    </span>
  </article>
</template>

<style lang="scss" module>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-height: 350px;
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.postId,
.userId {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.postId {
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--color-primary-active);
  background: var(--color-surface-primary-soft);
}

.userId {
  color: var(--color-text-secondary);
}

.content {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: center;
  flex: 1;
  max-width: 720px;
}

.title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 28px;
  line-height: 36px;
  text-transform: capitalize;
}

.body {
  margin: 20px 0 0;
  color: var(--color-text-secondary);
  font-size: 17px;
  line-height: 26px;
}

.decorativeNumber {
  position: absolute;
  right: -12px;
  bottom: -72px;
  color: var(--color-surface-primary-soft);
  font-size: 220px;
  font-weight: 800;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
</style>
