import type {
  IFeedbackDraftStorageState,
  IFeedbackFormValues,
  TFeedbackSubmissionState,
} from './types';

import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

import {
  FEEDBACK_DRAFT_STORAGE_KEY,
  FEEDBACK_DRAFT_STORAGE_VERSION,
  FEEDBACK_SUBMISSION_STATES,
} from './constants';

export const useFeedbackStore = defineStore('feedback', () => {
  const draft = ref<IFeedbackFormValues>(readStoredDraft());
  const submissionState = ref<TFeedbackSubmissionState>(FEEDBACK_SUBMISSION_STATES.IDLE);
  const submissionMessage = ref('');

  watch(draft, persistDraft, { deep: true, flush: 'sync' });

  function clearDraft() {
    draft.value = createEmptyFeedbackDraft();

    try {
      localStorage.removeItem(FEEDBACK_DRAFT_STORAGE_KEY);
    } catch {
      // The form remains usable when storage is unavailable.
    }
  }

  function resetSubmissionState() {
    submissionState.value = FEEDBACK_SUBMISSION_STATES.IDLE;
    submissionMessage.value = '';
  }

  function setDraft(values: IFeedbackFormValues) {
    draft.value = { ...values };
  }

  function setSubmissionState(state: TFeedbackSubmissionState, message = '') {
    submissionState.value = state;
    submissionMessage.value = message;
  }

  function persistDraft() {
    const hasValue = Object.values(draft.value).some(Boolean);

    try {
      if (!hasValue) {
        localStorage.removeItem(FEEDBACK_DRAFT_STORAGE_KEY);
        return;
      }

      const storageState: IFeedbackDraftStorageState = {
        draft: draft.value,
        version: FEEDBACK_DRAFT_STORAGE_VERSION,
      };

      localStorage.setItem(FEEDBACK_DRAFT_STORAGE_KEY, JSON.stringify(storageState));
    } catch {
      // The form remains usable when storage is unavailable or full.
    }
  }

  return {
    clearDraft,
    draft,
    resetSubmissionState,
    setDraft,
    setSubmissionState,
    submissionMessage,
    submissionState,
  };
});

export function createEmptyFeedbackDraft(): IFeedbackFormValues {
  return {
    email: '',
    message: '',
    name: '',
  };
}

function readStoredDraft(): IFeedbackFormValues {
  try {
    const rawStorageState = localStorage.getItem(FEEDBACK_DRAFT_STORAGE_KEY);

    if (!rawStorageState) {
      return createEmptyFeedbackDraft();
    }

    const storageState: unknown = JSON.parse(rawStorageState);

    if (
      !isFeedbackDraftStorageState(storageState) ||
      storageState.version !== FEEDBACK_DRAFT_STORAGE_VERSION
    ) {
      return createEmptyFeedbackDraft();
    }

    return storageState.draft;
  } catch {
    return createEmptyFeedbackDraft();
  }
}

function isFeedbackDraftStorageState(value: unknown): value is IFeedbackDraftStorageState {
  return (
    isRecord(value) &&
    isRecord(value.draft) &&
    typeof value.draft.email === 'string' &&
    typeof value.draft.message === 'string' &&
    typeof value.draft.name === 'string' &&
    typeof value.version === 'number'
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
