import type { IUser, TUserRole, TUserStatus } from '@/api/users';
import type { TUsersRoleFilter, TUsersStatusFilter } from '@/stores/users';
import type { IUiSelectOption, IUiTableColumn, TUiTagColor } from '@ui';

import { USER_ROLES, USER_STATUSES } from '@/api/users';
import { USERS_FILTER_ALL, USERS_PAGE_SIZES } from '@/stores/users';

export const USER_ROLE_LABELS: Record<TUserRole, string> = {
  [USER_ROLES.ADMIN]: 'Администратор',
  [USER_ROLES.EDITOR]: 'Редактор',
  [USER_ROLES.USER]: 'Пользователь',
};

export const USER_STATUS_LABELS: Record<TUserStatus, string> = {
  [USER_STATUSES.ACTIVE]: 'Активен',
  [USER_STATUSES.BLOCKED]: 'Заблокирован',
};

export const USER_ROLE_TAG_COLORS: Record<TUserRole, TUiTagColor> = {
  [USER_ROLES.ADMIN]: 'primary',
  [USER_ROLES.EDITOR]: 'info',
  [USER_ROLES.USER]: 'neutral',
};

export const USER_STATUS_TAG_COLORS: Record<TUserStatus, TUiTagColor> = {
  [USER_STATUSES.ACTIVE]: 'success',
  [USER_STATUSES.BLOCKED]: 'error',
};

export const USER_ROLE_FILTER_OPTIONS = [
  { label: 'Все роли', value: USERS_FILTER_ALL },
  ...Object.entries(USER_ROLE_LABELS).map(([value, label]) => ({ label, value })),
] satisfies readonly IUiSelectOption[];

export const USER_STATUS_FILTER_OPTIONS = [
  { label: 'Все статусы', value: USERS_FILTER_ALL },
  ...Object.entries(USER_STATUS_LABELS).map(([value, label]) => ({ label, value })),
] satisfies readonly IUiSelectOption[];

export const USER_PAGE_SIZE_OPTIONS = USERS_PAGE_SIZES.map((value) => {
  return {
    label: `${value} записей`,
    value,
  };
}) satisfies readonly IUiSelectOption[];

export const USER_TABLE_COLUMNS = [
  { key: 'name', label: 'Имя', sortable: true, width: '25%' },
  { key: 'email', label: 'Email', sortable: true, width: '28%' },
  { key: 'role', label: 'Роль', sortable: true, width: '17%' },
  { key: 'status', label: 'Статус', sortable: true, width: '15%' },
  { key: 'registeredAt', label: 'Дата регистрации', sortable: true, width: '15%' },
] as const satisfies readonly IUiTableColumn<IUser>[];

export function isUsersRoleFilter(value: unknown): value is TUsersRoleFilter {
  return USER_ROLE_FILTER_OPTIONS.some((option) => {
    return option.value === value;
  });
}

export function isUsersStatusFilter(value: unknown): value is TUsersStatusFilter {
  return USER_STATUS_FILTER_OPTIONS.some((option) => {
    return option.value === value;
  });
}
