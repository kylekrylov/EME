import type { TTabsPageValue } from '../types';
import type { TTabsDirection } from '@ui';

import { ref, useId, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { DEFAULT_TAB_VALUE, TABS_PAGE_ITEMS, TABS_QUERY_PARAM } from '../constants';

export function useTabsPage() {
  const route = useRoute();
  const router = useRouter();

  const activeTab = ref<TTabsPageValue>(DEFAULT_TAB_VALUE);
  const direction = ref<TTabsDirection>('left');
  const tabsId = useId();

  function getTabIndex(value: TTabsPageValue) {
    return TABS_PAGE_ITEMS.findIndex((item) => {
      return item.value === value;
    });
  }

  function isTabsPageValue(value: unknown): value is TTabsPageValue {
    return TABS_PAGE_ITEMS.some((item) => {
      return item.value === value;
    });
  }

  function setDirection(previousValue: TTabsPageValue, nextValue: TTabsPageValue) {
    direction.value = getTabIndex(nextValue) >= getTabIndex(previousValue) ? 'left' : 'right';
  }

  watch(
    () => route.query[TABS_QUERY_PARAM],
    async (queryValue) => {
      const nextValue = isTabsPageValue(queryValue) ? queryValue : DEFAULT_TAB_VALUE;

      if (nextValue !== activeTab.value) {
        setDirection(activeTab.value, nextValue);
        activeTab.value = nextValue;
      }

      if (queryValue !== nextValue) {
        await router.replace({
          query: {
            ...route.query,
            [TABS_QUERY_PARAM]: nextValue,
          },
        });
      }
    },
    { immediate: true },
  );

  watch(activeTab, async (nextValue, previousValue) => {
    setDirection(previousValue, nextValue);

    if (route.query[TABS_QUERY_PARAM] !== nextValue) {
      await router.replace({
        query: {
          ...route.query,
          [TABS_QUERY_PARAM]: nextValue,
        },
      });
    }
  });

  return {
    activeTab,
    direction,
    tabsId,
  };
}
