import check from './check.svg?raw';
import chevronDown from './chevron-down.svg?raw';
import close from './close.svg?raw';
import edit from './edit.svg?raw';
import trash from './trash.svg?raw';

export const icons = {
  check,
  'chevron-down': chevronDown,
  close,
  edit,
  trash,
} as const;

export type TIconName = keyof typeof icons;
