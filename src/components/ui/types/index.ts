import type { UI_SIZES } from '@ui/constants';
import type { TIconName } from '@ui/icon/icons';

export type TSize = (typeof UI_SIZES)[keyof typeof UI_SIZES];
export type TAppearanceType = 'primary' | 'secondary';
export type TAppearanceButton = TAppearanceType | 'error' | 'clean';
export type TAlertAppearance = 'error' | 'info' | 'success' | 'warning';
export type TInputAppearance = 'default' | 'error';
export type TTooltipPlacement = 'bottom' | 'left' | 'right' | 'top';

export interface IUiButtonBaseProps {
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit';
}

export interface IUiButtonProps extends IUiButtonBaseProps {
  active?: boolean;
  appearance?: TAppearanceButton;
}

export type { TIconName };
