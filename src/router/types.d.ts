import 'vue-router';

export {};

declare module 'vue-router' {
  interface RouteMeta {
    description?: string;
    title?: string;
  }
}
