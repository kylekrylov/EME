import type { IUiTabItem } from '@ui';

export const TABS_QUERY_PARAM = 'tab';

export const TABS_PAGE_ITEMS = [
  {
    title: 'Описание',
    value: 'overview',
  },
  {
    title: 'Возможности',
    value: 'features',
  },
  {
    title: 'Доступность',
    value: 'accessibility',
  },
] as const satisfies readonly IUiTabItem[];

export const DEFAULT_TAB_VALUE = TABS_PAGE_ITEMS[0].value;
