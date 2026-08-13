import { createRouter, createWebHistory } from 'vue-router';

import { APP_ROUTES } from '@/constants';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          redirect: { name: APP_ROUTES.USERS.name },
        },
        {
          path: APP_ROUTES.USERS.path.slice(1),
          name: APP_ROUTES.USERS.name,
          component: () => import('@/pages/users/UsersPage.vue'),
        },
        {
          path: APP_ROUTES.TABS.path.slice(1),
          name: APP_ROUTES.TABS.name,
          component: () => import('@/pages/tabs/TabsPage.vue'),
        },
        {
          path: APP_ROUTES.FEEDBACK.path.slice(1),
          name: APP_ROUTES.FEEDBACK.name,
          component: () => import('@/pages/feedback/FeedbackPage.vue'),
        },
        {
          path: APP_ROUTES.MODAL.path.slice(1),
          name: APP_ROUTES.MODAL.name,
          component: () => import('@/pages/modal/ModalPage.vue'),
        },
        {
          path: APP_ROUTES.INFINITE_SCROLL.path.slice(1),
          name: APP_ROUTES.INFINITE_SCROLL.name,
          component: () => import('@/pages/infinite-scroll/InfiniteScrollPage.vue'),
        },
        {
          path: APP_ROUTES.TODO.path.slice(1),
          name: APP_ROUTES.TODO.name,
          component: () => import('@/pages/todo/TodoPage.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/not-found/NotFoundPage.vue'),
    },
  ],
});

export default router;
