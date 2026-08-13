import type { FEEDBACK_SUBMISSION_STATES } from './constants';

export interface IFeedbackFormValues {
  email: string;
  message: string;
  name: string;
}

export interface IFeedbackDraftStorageState {
  draft: IFeedbackFormValues;
  version: number;
}

export type TFeedbackSubmissionState =
  (typeof FEEDBACK_SUBMISSION_STATES)[keyof typeof FEEDBACK_SUBMISSION_STATES];
