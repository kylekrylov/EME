export interface PageDefinition {
  readonly children?: Readonly<Record<string, PageDefinition>>;
  readonly metaDescription?: string;
  readonly name: string;
  readonly path: string;
  readonly showInNavigation?: boolean;
  readonly summary?: string;
  readonly title?: string;
}

export interface ResolvedPageDefinition {
  readonly children: readonly ResolvedPageDefinition[];
  readonly metaDescription?: string;
  readonly name: string;
  readonly path: string;
  readonly routePath: string;
  readonly showInNavigation: boolean;
  readonly summary?: string;
  readonly title?: string;
}

interface PageMetadata {
  readonly metaDescription?: string;
  readonly showInNavigation?: boolean;
  readonly summary?: string;
  readonly title?: string;
}

type PageDefinitions = Readonly<Record<string, PageDefinition>>;
type PageMetadataByName = Readonly<Record<string, PageMetadata | undefined>>;

const DEFAULT_PAGE_METADATA = {
  showInNavigation: false,
} as const;

export const PAGE_DEFINITIONS = {
  HOME: {
    metaDescription:
      'Шесть тестовых заданий Frontend-разработчика на Vue 3 и TypeScript с общей UI-библиотекой и архитектурой.',
    name: 'home',
    path: '/',
    showInNavigation: true,
    summary: 'Шесть самостоятельных интерфейсных задач на общей архитектурной основе.',
    title: 'Главная',
  },
  USERS: {
    metaDescription:
      'Таблица пользователей с сортировкой, фильтрами по роли и статусу и клиентской пагинацией.',
    name: 'users',
    path: '/users',
    showInNavigation: true,
    summary: 'Сортировка, фильтрация и пагинация данных пользователей из JSONPlaceholder.',
    title: 'Таблица пользователей',
  },
  TABS: {
    metaDescription:
      'Демонстрация доступных вкладок с анимацией контента, клавиатурной навигацией и синхронизацией с URL.',
    name: 'tabs',
    path: '/tabs',
    showInNavigation: true,
    summary: 'Доступные вкладки с анимацией, клавиатурной навигацией и состоянием в URL.',
    title: 'Табы',
  },
  FEEDBACK: {
    metaDescription:
      'Форма обратной связи с валидацией имени, email и сообщения, сохранением черновика и отправкой в mock API.',
    name: 'feedback',
    path: '/feedback',
    showInNavigation: true,
    summary: 'Валидация VeeValidate, сохранение черновика и отправка данных в mock API.',
    title: 'Форма обратной связи',
  },
  MODAL: {
    metaDescription:
      'Доступное модальное окно с focus trap, блокировкой прокрутки, действиями отмены и подтверждения и состоянием загрузки.',
    name: 'modal',
    path: '/modal',
    showInNavigation: true,
    summary: 'Focus trap, блокировка прокрутки и асинхронное подтверждение действия.',
    title: 'Модальное окно',
  },
  INFINITE_SCROLL: {
    metaDescription:
      'Лента публикаций JSONPlaceholder с бесконечной прокруткой, порционной загрузкой и skeleton-состояниями.',
    name: 'infinite-scroll',
    path: '/infinite-scroll',
    showInNavigation: true,
    summary: 'Порционная загрузка REST API, skeleton-состояния и прокрутка внутри блока.',
    title: 'Infinite scroll лента',
  },
  TODO: {
    metaDescription:
      'Список задач с созданием, inline-редактированием, фильтрацией, сохранением в localStorage и подтверждением удаления.',
    name: 'todo',
    path: '/todo',
    showInNavigation: true,
    summary: 'CRUD, inline-редактирование, фильтрация и сохранение задач в localStorage.',
    title: 'Список задач',
  },
} as const satisfies PageDefinitions;

function resolveAbsolutePath(parentPath: string, routePath: string) {
  if (routePath.startsWith('/')) {
    return routePath;
  }

  const pathSegments = [...parentPath.split('/'), ...routePath.split('/')].filter(Boolean);

  return `/${pathSegments.join('/')}`;
}

function resolvePageMetadata(definition: PageDefinition, additionalMetadata: PageMetadata = {}) {
  return {
    metaDescription: additionalMetadata.metaDescription ?? definition.metaDescription,
    showInNavigation:
      additionalMetadata.showInNavigation ??
      definition.showInNavigation ??
      DEFAULT_PAGE_METADATA.showInNavigation,
    summary: additionalMetadata.summary ?? definition.summary,
    title: additionalMetadata.title ?? definition.title,
  };
}

function resolvePageDefinitions(
  definitions: PageDefinitions,
  metadataByName: PageMetadataByName = {},
) {
  const registeredNames = new Set<string>();
  const registeredPaths = new Set<string>();

  function resolveDefinitions(
    currentDefinitions: PageDefinitions,
    parentPath = '',
    isNested = false,
  ): ResolvedPageDefinition[] {
    return Object.values(currentDefinitions).map((definition) => {
      const isAbsolutePath = definition.path.startsWith('/');

      if (isNested === isAbsolutePath) {
        throw new Error(
          `Путь страницы "${definition.name}" должен быть ${isNested ? 'относительным' : 'абсолютным'}`,
        );
      }

      const path = resolveAbsolutePath(parentPath, definition.path);

      if (registeredNames.has(definition.name)) {
        throw new Error(`Имя страницы "${definition.name}" должно быть уникальным`);
      }

      if (registeredPaths.has(path)) {
        throw new Error(`Путь страницы "${path}" должен быть уникальным`);
      }

      registeredNames.add(definition.name);
      registeredPaths.add(path);

      return {
        ...resolvePageMetadata(definition, metadataByName[definition.name]),
        children: resolveDefinitions(definition.children ?? {}, path, true),
        name: definition.name,
        path,
        routePath: definition.path,
      };
    });
  }

  return resolveDefinitions(definitions);
}

function flattenPages(pages: readonly ResolvedPageDefinition[]): ResolvedPageDefinition[] {
  return pages.flatMap((page) => {
    return [page, ...flattenPages(page.children)];
  });
}

export const RESOLVED_PAGE_DEFINITIONS = resolvePageDefinitions(PAGE_DEFINITIONS);

const pages = flattenPages(RESOLVED_PAGE_DEFINITIONS);

export const NAVIGATION_PAGES = pages.filter(({ showInNavigation }) => showInNavigation);
export const TASK_PAGES = NAVIGATION_PAGES.filter(
  ({ name }) => name !== PAGE_DEFINITIONS.HOME.name,
);
export const STATIC_PAGE_PATHS = pages
  .filter(({ name }) => name !== PAGE_DEFINITIONS.HOME.name)
  .map(({ path }) => path);
