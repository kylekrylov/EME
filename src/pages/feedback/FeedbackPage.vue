<script setup lang="ts">
import type { TFeedbackSubmissionState } from '@/stores/feedback';
import type { TAlertAppearance } from '@ui';

import { computed } from 'vue';

import PageHeader from '@/components/layout/PageHeader.vue';
import { FEEDBACK_FIELD_LIMITS } from '@/stores/feedback';
import { UiAlert, UiButton, UiField, UiInput, UiTextarea } from '@ui';

import { useFeedbackPage } from './composables/useFeedbackPage';

interface SubmissionAlert {
  appearance: TAlertAppearance;
  title: string;
}

const SUBMISSION_ALERT_BY_STATE = {
  error: {
    appearance: 'error',
    title: 'Сообщение не отправлено',
  },
  idle: null,
  submitting: null,
  success: {
    appearance: 'success',
    title: 'Сообщение отправлено',
  },
} as const satisfies Record<TFeedbackSubmissionState, SubmissionAlert | null>;

const {
  dismissSubmissionMessage,
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
} = useFeedbackPage();

const submissionAlert = computed(() => {
  return SUBMISSION_ALERT_BY_STATE[submissionState.value];
});
</script>

<template>
  <section :class="$style.page">
    <PageHeader>
      <template #title>Форма обратной связи</template>
      <template #requirements>
        Поля имени, email и сообщения, валидация при вводе, отправка и состояния результата.
      </template>
      <template #implementation>
        VeeValidate проверяет форму, Pinia сохраняет черновик, запрос обрабатывает локальный mock
        API.
      </template>
    </PageHeader>

    <UiAlert
      v-if="submissionAlert"
      :appearance="submissionAlert.appearance"
      :class="$style.alert"
      :text="submissionMessage"
      :title="submissionAlert.title"
      @close="dismissSubmissionMessage"
    />

    <form
      :class="$style.form"
      novalidate
      @submit="submitForm"
    >
      <UiField
        v-slot="{ describedBy, id }"
        :error="errors.name"
        label="Имя"
        required
      >
        <UiInput
          :id="id"
          v-model="name"
          v-bind="nameAttributes"
          :appearance="errors.name ? 'error' : 'default'"
          :aria-describedby="describedBy"
          autocomplete="name"
          :clearable="false"
          :disabled="isSubmitting"
          :maxlength="FEEDBACK_FIELD_LIMITS.NAME_MAX_LENGTH"
          placeholder="Как к вам обращаться"
        />
      </UiField>

      <UiField
        v-slot="{ describedBy, id }"
        :error="errors.email"
        label="Email"
        required
      >
        <UiInput
          :id="id"
          v-model="email"
          v-bind="emailAttributes"
          :appearance="errors.email ? 'error' : 'default'"
          :aria-describedby="describedBy"
          autocomplete="email"
          :clearable="false"
          :disabled="isSubmitting"
          :maxlength="FEEDBACK_FIELD_LIMITS.EMAIL_MAX_LENGTH"
          placeholder="name@example.com"
          type="email"
        />
      </UiField>

      <UiField
        :error="errors.message"
        hint="Опишите вопрос или предложение подробным сообщением."
        label="Сообщение"
        required
      >
        <template #labelRight>
          <span :class="$style.counter">
            {{ messageLength }} / {{ FEEDBACK_FIELD_LIMITS.MESSAGE_MAX_LENGTH }}
          </span>
        </template>

        <template #default="{ describedBy, id }">
          <UiTextarea
            :id="id"
            v-model="message"
            v-bind="messageAttributes"
            :appearance="errors.message ? 'error' : 'default'"
            :aria-describedby="describedBy"
            :disabled="isSubmitting"
            :maxlength="FEEDBACK_FIELD_LIMITS.MESSAGE_MAX_LENGTH"
            placeholder="Расскажите, чем мы можем помочь"
          />
        </template>
      </UiField>

      <div :class="$style.footer">
        <p :class="$style.draftHint">Черновик автоматически сохраняется только в этом браузере.</p>
        <UiButton
          :loading="isSubmitting"
          size="lg"
          type="submit"
        >
          Отправить
        </UiButton>
      </div>
    </form>
  </section>
</template>

<style lang="scss" module>
.page {
  width: 100%;
}

.alert {
  margin-top: 24px;
}

.form {
  display: grid;
  gap: 22px;
  margin-top: 28px;
  padding: 28px;
  border: 1px solid var(--color-border-secondary);
  border-radius: 20px;
  background: var(--color-surface-base);
}

.counter {
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 18px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 2px;
}

.draftHint {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 18px;
}

@media (max-width: 600px) {
  .form {
    padding: 20px;
  }

  .footer {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
