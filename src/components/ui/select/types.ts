export type TUiSelectValue = number | string;

export interface IUiSelectOption {
  disabled?: boolean;
  label: string;
  value: TUiSelectValue;
}
