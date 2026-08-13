import { createRouter, createWebHistory } from 'vue-router';

import { APP_ROUTES } from '@/constants';

import { updateDocumentMeta } from './meta';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: APP_ROUTES.HOME.name,
          component: () => import('@/pages/home/HomePage.vue'),
          meta: {
            description:
              'Шесть тестовых заданий Frontend-разработчика на Vue 3 и TypeScript с общей UI-библиотекой и архитектурой.',
            title: 'Главная',
          },
        },
        {
          path: APP_ROUTES.USERS.path.slice(1),
          name: APP_ROUTES.USERS.name,
          component: () => import('@/pages/users/UsersPage.vue'),
          meta: {
            description:
              'Таблица пользователей с сортировкой, фильтрами по роли и статусу и клиентской пагинацией.',
            title: 'Таблица пользователей',
          },
        },
        {
          path: APP_ROUTES.TABS.path.slice(1),
          name: APP_ROUTES.TABS.name,
          component: () => import('@/pages/tabs/TabsPage.vue'),
          meta: {
            description:
              'Демонстрация доступных вкладок с анимацией контента, клавиатурной навигацией и синхронизацией с URL.',
            title: 'Табы',
          },
        },
        {
          path: APP_ROUTES.FEEDBACK.path.slice(1),
          name: APP_ROUTES.FEEDBACK.name,
          component: () => import('@/pages/feedback/FeedbackPage.vue'),
          meta: {
            description:
              'Форма обратной связи с валидацией имени, email и сообщения, сохранением черновика и отправкой в mock API.',
            title: 'Форма обратной связи',
          },
        },
        {
          path: APP_ROUTES.MODAL.path.slice(1),
          name: APP_ROUTES.MODAL.name,
          component: () => import('@/pages/modal/ModalPage.vue'),
          meta: {
            description:
              'Доступное модальное окно с focus trap, блокировкой прокрутки, действиями отмены и подтверждения и состоянием загрузки.',
            title: 'Модальное окно',
          },
        },
        {
          path: APP_ROUTES.INFINITE_SCROLL.path.slice(1),
          name: APP_ROUTES.INFINITE_SCROLL.name,
          component: () => import('@/pages/infinite-scroll/InfiniteScrollPage.vue'),
          meta: {
            description:
              'Лента публикаций JSONPlaceholder с бесконечной прокруткой, порционной загрузкой и skeleton-состояниями.',
            title: 'Infinite scroll лента',
          },
        },
        {
          path: APP_ROUTES.TODO.path.slice(1),
          name: APP_ROUTES.TODO.name,
          component: () => import('@/pages/todo/TodoPage.vue'),
          meta: {
            description:
              'Список задач с созданием, inline-редактированием, фильтрацией, сохранением в localStorage и подтверждением удаления.',
            title: 'Список задач',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/not-found/NotFoundPage.vue'),
      meta: {
        description: 'Запрошенная страница проекта EME не найдена.',
        title: 'Страница не найдена',
      },
    },
  ],
});

router.afterEach(updateDocumentMeta);

export default router;
