export type TUiTableAlign = 'center' | 'left' | 'right';
export type TUiTableSortDirection = 'asc' | 'desc' | null;

export interface IUiTableColumn<TRow> {
  align?: TUiTableAlign;
  key: keyof TRow & string;
  label: string;
  sortable?: boolean;
  width?: string;
}
