import type { TIconName } from '@ui/types';

export interface IUiTabItem {
  disabled?: boolean;
  iconLeft?: TIconName;
  iconRight?: TIconName;
  title: string;
  value: string;
}

export type TTabsDirection = 'left' | 'right';
