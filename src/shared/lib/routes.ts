// src/shared/lib/routes.ts
export const routes = {
    // публичные
    login: () => '/login',
    register: () => '/register',
    forgotPassword: () => '/forgot-password',
  
    // защищённые
    dashboard: () => '/',
    projects: {
      list: () => '/projects',
      detail: (id: string | number) => `/projects/${id}`,
      settings: (id: string | number) => `/projects/${id}/settings`,
    },
    tasks: () => '/tasks',
    profile: () => '/profile',
  
    // 404
    notFound: () => '*',
  } as const;
  
  // Тип для автодополнения (опционально, но очень полезно)
  export type RouteKeys = typeof routes;