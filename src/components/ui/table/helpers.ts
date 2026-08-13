import type { CSSProperties } from 'vue';
import type { IUiTableColumn } from './types';

export function getTableColumnStyles<TRow>(column: IUiTableColumn<TRow>): CSSProperties {
  return {
    textAlign: column.align ?? 'left',
    width: column.width,
  };
}
