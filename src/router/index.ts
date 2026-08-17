import type { RouteComponent, RouteRecordRaw } from 'vue-router';
import type { ResolvedPageDefinition } from '@/constants';

import { createRouter, createWebHistory } from 'vue-router';

import { PAGE_DEFINITIONS, RESOLVED_PAGE_DEFINITIONS } from '@/constants';

import { updateDocumentMeta } from './meta';

type PageComponentLoader = () => Promise<{ default: RouteComponent }>;

const LEADING_SLASH_PATTERN = /^\//;
const PAGE_COMPONENTS: Readonly<Record<string, PageComponentLoader>> = {
  [PAGE_DEFINITIONS.FEEDBACK.name]: () => import('@/pages/feedback/FeedbackPage.vue'),
  [PAGE_DEFINITIONS.HOME.name]: () => import('@/pages/home/HomePage.vue'),
  [PAGE_DEFINITIONS.INFINITE_SCROLL.name]: () =>
    import('@/pages/infinite-scroll/InfiniteScrollPage.vue'),
  [PAGE_DEFINITIONS.MODAL.name]: () => import('@/pages/modal/ModalPage.vue'),
  [PAGE_DEFINITIONS.TABS.name]: () => import('@/pages/tabs/TabsPage.vue'),
  [PAGE_DEFINITIONS.TODO.name]: () => import('@/pages/todo/TodoPage.vue'),
  [PAGE_DEFINITIONS.USERS.name]: () => import('@/pages/users/UsersPage.vue'),
};

function createPageRoutes(
  pages: readonly ResolvedPageDefinition[],
  isLayoutChild = true,
): RouteRecordRaw[] {
  return pages.map((page) => {
    const component = PAGE_COMPONENTS[page.name];

    if (!component) {
      throw new Error(`Для страницы "${page.name}" не задан загрузчик компонента`);
    }

    return {
      path: isLayoutChild ? page.routePath.replace(LEADING_SLASH_PATTERN, '') : page.routePath,
      name: page.name,
      component,
      meta: {
        description: page.metaDescription,
        title: page.title,
      },
      ...(page.children.length > 0 && {
        children: createPageRoutes(page.children, false),
      }),
    };
  });
}

const pageRoutes = createPageRoutes(RESOLVED_PAGE_DEFINITIONS);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: pageRoutes,
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
