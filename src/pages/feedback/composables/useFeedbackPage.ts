import { storeToRefs } from 'pinia';
import { useForm } from 'vee-validate';
import { computed, onBeforeUnmount, watch } from 'vue';

import { submitFeedback } from '@/api/feedback';
import {
  createEmptyFeedbackDraft,
  FEEDBACK_SUBMISSION_STATES,
  useFeedbackStore,
} from '@/stores/feedback';
import { feedbackValidationSchema } from '@/validations';

export function useFeedbackPage() {
  const feedbackStore = useFeedbackStore();
  const { draft, submissionMessage, submissionState } = storeToRefs(feedbackStore);
  const { clearDraft, resetSubmissionState, setDraft, setSubmissionState } = feedbackStore;

  resetSubmissionState();

  const { defineField, errors, handleSubmit, isSubmitting, resetForm, values } = useForm({
    initialValues: { ...draft.value },
    validationSchema: feedbackValidationSchema,
  });

  const fieldOptions = {
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
  } as const;

  const [name, nameAttributes] = defineField('name', fieldOptions);
  const [email, emailAttributes] = defineField('email', fieldOptions);
  const [message, messageAttributes] = defineField('message', fieldOptions);

  const messageLength = computed(() => message.value.trim().length);

  let requestController: AbortController | null = null;

  watch(
    values,
    (formValues) => {
      setDraft({ ...formValues });

      if (
        submissionState.value === FEEDBACK_SUBMISSION_STATES.ERROR ||
        submissionState.value === FEEDBACK_SUBMISSION_STATES.SUCCESS
      ) {
        resetSubmissionState();
      }
    },
    { deep: true, flush: 'sync' },
  );

  const submitForm = handleSubmit(async (formValues) => {
    requestController?.abort();
    requestController = new AbortController();
    setSubmissionState(FEEDBACK_SUBMISSION_STATES.SUBMITTING);

    const normalizedValues = {
      email: formValues.email.trim(),
      message: formValues.message,
      name: formValues.name.trim(),
    };

    try {
      await submitFeedback(normalizedValues, requestController.signal);

      resetForm({ values: createEmptyFeedbackDraft() });
      clearDraft();
      setSubmissionState(
        FEEDBACK_SUBMISSION_STATES.SUCCESS,
        `Спасибо, ${normalizedValues.name}! Сообщение принято.`,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        resetSubmissionState();
        return;
      }

      setSubmissionState(
        FEEDBACK_SUBMISSION_STATES.ERROR,
        'Не удалось отправить сообщение. Проверьте подключение и попробуйте ещё раз.',
      );
    } finally {
      requestController = null;
    }
  }, resetSubmissionState);

  onBeforeUnmount(() => {
    requestController?.abort();
  });

  return {
    dismissSubmissionMessage: resetSubmissionState,
    email,
    emailAttributes,
    errors,
    isSubmitting,
    message,
    messageAttributes,
    messageLength,
    name,
    nameAttributes,
    submissionMessage,
    submissionState,
    submitForm,
  };
}
