import type { USER_ROLES, USER_STATUSES } from './constants';

export interface IJsonPlaceholderUser {
  email: string;
  id: number;
  name: string;
}

export interface IUser {
  email: string;
  id: number;
  name: string;
  registeredAt: string;
  role: TUserRole;
  status: TUserStatus;
}

export type TUserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type TUserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];
