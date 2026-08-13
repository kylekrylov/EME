import type { IFeedbackFormValues } from '@/stores/feedback';

import { FEEDBACK_FIELD_LIMITS } from '@/stores/feedback';

type TValidationResult = string | true;
type TValidationRule = (value: unknown) => TValidationResult;

const WHITESPACE_PATTERN = /\s/;

export const feedbackValidationSchema = {
  email: validateEmail,
  message: validateMessage,
  name: validateName,
} satisfies Record<keyof IFeedbackFormValues, TValidationRule>;

function validateEmail(value: unknown): TValidationResult {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Введите email.';
  }

  const normalizedEmail = value.trim();

  if (normalizedEmail.length > FEEDBACK_FIELD_LIMITS.EMAIL_MAX_LENGTH) {
    return `Email должен быть не длиннее ${FEEDBACK_FIELD_LIMITS.EMAIL_MAX_LENGTH} символов.`;
  }

  return isValidEmail(normalizedEmail) || 'Введите корректный email.';
}

function validateMessage(value: unknown): TValidationResult {
  const text = typeof value === 'string' ? value.trim() : '';

  if (!text) {
    return 'Введите сообщение.';
  }

  if (text.length < FEEDBACK_FIELD_LIMITS.MESSAGE_MIN_LENGTH) {
    return `Сообщение должно содержать не менее ${FEEDBACK_FIELD_LIMITS.MESSAGE_MIN_LENGTH} символов.`;
  }

  if (text.length > FEEDBACK_FIELD_LIMITS.MESSAGE_MAX_LENGTH) {
    return `Сообщение должно быть не длиннее ${FEEDBACK_FIELD_LIMITS.MESSAGE_MAX_LENGTH} символов.`;
  }

  return true;
}

function validateName(value: unknown): TValidationResult {
  if (typeof value !== 'string' || !value.trim()) {
    return 'Введите имя.';
  }

  const normalizedName = value.trim();

  if (normalizedName.length < FEEDBACK_FIELD_LIMITS.NAME_MIN_LENGTH) {
    return `Имя должно содержать не менее ${FEEDBACK_FIELD_LIMITS.NAME_MIN_LENGTH} символов.`;
  }

  if (normalizedName.length > FEEDBACK_FIELD_LIMITS.NAME_MAX_LENGTH) {
    return `Имя должно быть не длиннее ${FEEDBACK_FIELD_LIMITS.NAME_MAX_LENGTH} символов.`;
  }

  return true;
}

function isValidEmail(value: string) {
  const separatorPosition = value.indexOf('@');
  const dotPosition = value.indexOf('.', separatorPosition + 2);

  return (
    separatorPosition > 0 &&
    separatorPosition === value.lastIndexOf('@') &&
    separatorPosition < value.length - 1 &&
    dotPosition > separatorPosition + 1 &&
    dotPosition < value.length - 1 &&
    !WHITESPACE_PATTERN.test(value)
  );
}
