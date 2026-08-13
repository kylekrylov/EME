import type { IPost } from '@/api/posts';
import { computed, onBeforeUnmount, ref } from 'vue';
import { getPostsPage } from '@/api/posts';
import { INITIAL_LOADING_MIN_DURATION_MS, POSTS_PAGE_SIZE } from '../constants';

export function useInfinitePostsPage() {
  const posts = ref<IPost[]>([]);
  const errorMessage = ref('');
  const isInitialLoading = ref(false);
  const isLoadingMore = ref(false);
  const lastPageSize = ref(POSTS_PAGE_SIZE);
  const total = ref<number | null>(null);

  let abortController: AbortController | null = null;

  const isLoading = computed(() => isInitialLoading.value || isLoadingMore.value);
  const hasMore = computed(() => {
    if (total.value !== null) {
      return posts.value.length < total.value;
    }

    return lastPageSize.value === POSTS_PAGE_SIZE;
  });

  async function loadMore() {
    if (isLoading.value || !hasMore.value) {
      return;
    }

    const isInitialRequest = posts.value.length === 0;
    const currentController = new AbortController();

    abortController = currentController;
    errorMessage.value = '';
    isInitialLoading.value = isInitialRequest;
    isLoadingMore.value = !isInitialRequest;

    try {
      const initialLoadingDelay = isInitialRequest
        ? wait(INITIAL_LOADING_MIN_DURATION_MS)
        : Promise.resolve();
      const [page] = await Promise.all([
        getPostsPage({
          limit: POSTS_PAGE_SIZE,
          signal: currentController.signal,
          start: posts.value.length,
        }),
        initialLoadingDelay,
      ]);

      const loadedPostIds = new Set(posts.value.map(({ id }) => id));
      const newPosts = page.posts.filter(({ id }) => !loadedPostIds.has(id));

      posts.value.push(...newPosts);
      lastPageSize.value = page.posts.length;
      total.value = page.total;
    } catch (error: unknown) {
      if (!isAbortError(error)) {
        errorMessage.value = 'Не удалось загрузить публикации. Попробуйте ещё раз.';
      }
    } finally {
      if (abortController === currentController) {
        abortController = null;
        isInitialLoading.value = false;
        isLoadingMore.value = false;
      }
    }
  }

  function isAbortError(error: unknown) {
    return error instanceof DOMException && error.name === 'AbortError';
  }

  onBeforeUnmount(() => {
    abortController?.abort();
  });

  return {
    errorMessage,
    hasMore,
    isInitialLoading,
    isLoadingMore,
    loadMore,
    posts,
    total,
  };
}

function wait(durationMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });
}
