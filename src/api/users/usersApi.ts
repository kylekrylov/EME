import type { IJsonPlaceholderUser, IUser } from './types';

import { getJson } from '@/api/httpClient';

import { USER_ROLES, USER_STATUSES, USERS_DEMO_COPIES_COUNT, USERS_RESOURCE } from './constants';

const REGISTRATION_START_TIMESTAMP = Date.UTC(2021, 0, 15);
const REGISTRATION_STEP_DAYS = 23;
const MILLISECONDS_IN_DAY = 86_400_000;
const USER_ROLE_SEQUENCE = [USER_ROLES.ADMIN, USER_ROLES.EDITOR, USER_ROLES.USER] as const;

export async function getUsers(signal?: AbortSignal) {
  const { data } = await getJson<IJsonPlaceholderUser[]>(USERS_RESOURCE, { signal });
  return createDemoUsers(data);
}

function createDemoUsers(sourceUsers: IJsonPlaceholderUser[]) {
  const copyIndexes = Array.from({ length: USERS_DEMO_COPIES_COUNT }, (_, index) => index);

  return copyIndexes.flatMap((copyIndex) => {
    return sourceUsers.map((sourceUser, userIndex) => {
      const id = copyIndex * sourceUsers.length + sourceUser.id;
      const role = USER_ROLE_SEQUENCE[(id - 1) % USER_ROLE_SEQUENCE.length] ?? USER_ROLES.USER;
      const registrationOffset = (id + userIndex) * REGISTRATION_STEP_DAYS * MILLISECONDS_IN_DAY;

      return {
        email: createDemoEmail(sourceUser.email, copyIndex),
        id,
        name: copyIndex === 0 ? sourceUser.name : `${sourceUser.name} ${copyIndex + 1}`,
        registeredAt: new Date(REGISTRATION_START_TIMESTAMP + registrationOffset).toISOString(),
        role,
        status: id % 4 === 0 ? USER_STATUSES.BLOCKED : USER_STATUSES.ACTIVE,
      } satisfies IUser;
    });
  });
}

function createDemoEmail(email: string, copyIndex: number) {
  if (copyIndex === 0) {
    return email;
  }

  const separatorIndex = email.lastIndexOf('@');

  if (separatorIndex === -1) {
    return `${email}+demo${copyIndex + 1}`;
  }

  return `${email.slice(0, separatorIndex)}+demo${copyIndex + 1}${email.slice(separatorIndex)}`;
}
