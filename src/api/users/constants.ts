export const USERS_RESOURCE = '/users';
export const USERS_DEMO_COPIES_COUNT = 6;

export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  USER: 'user',
} as const;

export const USER_STATUSES = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
} as const;
