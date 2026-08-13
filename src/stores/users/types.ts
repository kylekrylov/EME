import type { USERS_FILTER_ALL } from './constants';
import type { IUser, TUserRole, TUserStatus } from '@/api/users';

export type TUsersRoleFilter = TUserRole | typeof USERS_FILTER_ALL;
export type TUsersSortDirection = 'asc' | 'desc' | null;
export type TUsersStatusFilter = TUserStatus | typeof USERS_FILTER_ALL;
export type TUsersSortKey = keyof Pick<
  IUser,
  'email' | 'name' | 'registeredAt' | 'role' | 'status'
>;
