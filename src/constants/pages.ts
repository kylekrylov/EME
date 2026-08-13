import { APP_ROUTES } from './routes';

export const APP_PAGES = [
  {
    description: 'Сортировка, фильтрация и пагинация данных пользователей из JSONPlaceholder.',
    routeName: APP_ROUTES.USERS.name,
    title: 'Таблица пользователей',
  },
  {
    description: 'Доступные вкладки с анимацией, клавиатурной навигацией и состоянием в URL.',
    routeName: APP_ROUTES.TABS.name,
    title: 'Табы',
  },
  {
    description: 'Валидация VeeValidate, сохранение черновика и отправка данных в mock API.',
    routeName: APP_ROUTES.FEEDBACK.name,
    title: 'Форма обратной связи',
  },
  {
    description: 'Focus trap, блокировка прокрутки и асинхронное подтверждение действия.',
    routeName: APP_ROUTES.MODAL.name,
    title: 'Модальное окно',
  },
  {
    description: 'Порционная загрузка REST API, skeleton-состояния и прокрутка внутри блока.',
    routeName: APP_ROUTES.INFINITE_SCROLL.name,
    title: 'Infinite scroll лента',
  },
  {
    description: 'CRUD, inline-редактирование, фильтрация и сохранение задач в localStorage.',
    routeName: APP_ROUTES.TODO.name,
    title: 'Список задач',
  },
] as const;
