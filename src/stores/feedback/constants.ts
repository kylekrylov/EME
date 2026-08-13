export const FEEDBACK_DRAFT_STORAGE_KEY = 'eme:feedback-draft';
export const FEEDBACK_DRAFT_STORAGE_VERSION = 1;

export const FEEDBACK_FIELD_LIMITS = {
  EMAIL_MAX_LENGTH: 254,
  MESSAGE_MAX_LENGTH: 2000,
  MESSAGE_MIN_LENGTH: 10,
  NAME_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
} as const;

export const FEEDBACK_SUBMISSION_STATES = {
  ERROR: 'error',
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
} as const;
