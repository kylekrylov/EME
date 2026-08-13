import type { ISubmitFeedbackRequest, ISubmitFeedbackResponse } from './types';

import { FEEDBACK_MOCK_DELAY_MS, FEEDBACK_MOCK_ERROR_EMAIL } from './constants';

export function submitFeedback(feedback: ISubmitFeedbackRequest, signal?: AbortSignal) {
  return new Promise<ISubmitFeedbackResponse>((resolve, reject) => {
    if (signal?.aborted) {
      reject(createAbortError());
      return;
    }

    const timeoutId = setTimeout(() => {
      removeAbortListener();

      if (feedback.email.toLowerCase() === FEEDBACK_MOCK_ERROR_EMAIL) {
        reject(new Error('Feedback mock request failed.'));
        return;
      }

      resolve({
        ...feedback,
        id: crypto.randomUUID(),
        submittedAt: new Date().toISOString(),
      });
    }, FEEDBACK_MOCK_DELAY_MS);

    function abortRequest() {
      clearTimeout(timeoutId);
      removeAbortListener();
      reject(createAbortError());
    }

    function removeAbortListener() {
      signal?.removeEventListener('abort', abortRequest);
    }

    signal?.addEventListener('abort', abortRequest, { once: true });
  });
}

function createAbortError() {
  return new DOMException('Feedback request was aborted.', 'AbortError');
}
