import type { RouteLocationNormalized } from 'vue-router';

const APP_NAME = 'EME';
const DEFAULT_DESCRIPTION = 'Шесть тестовых заданий Frontend-разработчика на Vue 3 и TypeScript.';
const DEFAULT_TITLE = `${APP_NAME} — тестовые задания Frontend-разработчика`;

export function updateDocumentMeta(route: RouteLocationNormalized) {
  document.title = route.meta.title ? `${route.meta.title} — ${APP_NAME}` : DEFAULT_TITLE;

  const descriptionElement = document.querySelector<HTMLMetaElement>('meta[name="description"]');

  if (descriptionElement) {
    descriptionElement.content = route.meta.description || DEFAULT_DESCRIPTION;
  }
}
