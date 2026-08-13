<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

import PageHeader from '@/components/layout/PageHeader.vue';
import { UiButton, UiScrollContainer } from '@ui';
import PostCard from './components/PostCard.vue';
import PostCardSkeleton from './components/PostCardSkeleton.vue';
import { useInfinitePostsPage } from './composables/useInfinitePostsPage';
import { INFINITE_SCROLL_ROOT_MARGIN_PX, INITIAL_POST_SKELETON_COUNT } from './constants';

const scrollContainer = ref<InstanceType<typeof UiScrollContainer>>();
const sentinel = ref<HTMLElement>();

const { errorMessage, hasMore, isInitialLoading, isLoadingMore, loadMore, posts, total } =
  useInfinitePostsPage();

let intersectionObserver: IntersectionObserver | null = null;

function createIntersectionObserver() {
  const scrollElement = scrollContainer.value?.getScrollElement();

  if (!scrollElement || !sentinel.value) {
    return;
  }

  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && !errorMessage.value) {
        void loadMore();
      }
    },
    {
      root: scrollElement,
      rootMargin: `0px 0px ${INFINITE_SCROLL_ROOT_MARGIN_PX}px`,
    },
  );

  intersectionObserver.observe(sentinel.value);
}

onMounted(async () => {
  await loadMore();
  await nextTick();
  createIntersectionObserver();
});

onBeforeUnmount(() => {
  intersectionObserver?.disconnect();
});
</script>

<template>
  <section :class="$style.page">
    <PageHeader>
      <template #title>Infinite scroll лента</template>
      <template #requirements>
        Публикации REST API, карточки с минимальной высотой 350px, скелетоны и дозагрузка во
        внутреннем scroll-блоке.
      </template>
      <template #implementation>
        JSONPlaceholder загружается порциями, IntersectionObserver следит за sentinel в
        UiScrollContainer.
      </template>
      <template #aside>
        <span v-if="total !== null">{{ posts.length }} из {{ total }}</span>
      </template>
    </PageHeader>

    <UiScrollContainer
      ref="scrollContainer"
      :aria-busy="isInitialLoading || isLoadingMore"
      aria-label="Лента публикаций"
      :class="$style.feed"
      tabindex="0"
    >
      <div
        v-if="isInitialLoading"
        aria-live="polite"
        :class="$style.skeletonList"
        role="status"
      >
        <span :class="$style.visuallyHidden">Загружаем публикации…</span>
        <PostCardSkeleton
          v-for="index in INITIAL_POST_SKELETON_COUNT"
          :key="index"
        />
      </div>

      <template v-else>
        <ol
          v-if="posts.length"
          :class="$style.list"
        >
          <li
            v-for="post in posts"
            :key="post.id"
          >
            <PostCard :post="post" />
          </li>
        </ol>

        <div
          v-if="errorMessage"
          :class="$style.centeredState"
          role="alert"
        >
          <p :class="$style.stateText">{{ errorMessage }}</p>
          <UiButton
            appearance="secondary"
            size="sm"
            type="button"
            @click="loadMore"
          >
            Повторить
          </UiButton>
        </div>

        <div
          v-else-if="!posts.length"
          :class="$style.centeredState"
          role="status"
        >
          <p :class="$style.stateText">Публикаций пока нет.</p>
        </div>

        <div
          v-else-if="hasMore"
          aria-live="polite"
          :class="$style.loadMore"
          role="status"
        >
          <PostCardSkeleton
            v-if="isLoadingMore"
            :class="$style.loadingMoreSkeleton"
          />
          <span
            v-if="isLoadingMore"
            :class="$style.visuallyHidden"
          >
            Загружаем ещё публикации…
          </span>
          <UiButton
            v-else
            appearance="secondary"
            size="sm"
            type="button"
            @click="loadMore"
          >
            Загрузить ещё
          </UiButton>
        </div>

        <p
          v-else-if="posts.length"
          :class="$style.endMessage"
          role="status"
        >
          Все публикации загружены
        </p>

        <div
          ref="sentinel"
          aria-hidden="true"
          :class="$style.sentinel"
        />
      </template>
    </UiScrollContainer>
  </section>
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  overflow: hidden;
}

.feed {
  margin-top: 24px;
}

.list {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skeletonList {
  display: grid;
  gap: 16px;
}

.centeredState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 180px;
  color: var(--color-text-secondary);
  text-align: center;
}

.stateText {
  margin: 0;
}

.loadMore {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 88px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loadingMoreSkeleton {
  margin-top: 16px;
}

.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.endMessage {
  margin: 0;
  padding: 28px 16px 12px;
  color: var(--color-text-secondary);
  font-size: 14px;
  text-align: center;
}

.sentinel {
  height: 1px;
}
</style>
