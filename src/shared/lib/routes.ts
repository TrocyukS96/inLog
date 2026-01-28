// src/shared/lib/routes.ts
export const routes = {
    // публичные
    login: () => '/login',
    register: () => '/register',
    forgotPassword: () => '/forgot-password',
    passwordRecovery: () => '/recovery',
    recoveryMessage: () => '/recovery-message',
    resetConfirm: () => '/recover',
    recoveryChange: () => '/recovery-change',
    checkEmail: () => '/check-email',
    changeEmail: () => '/change-email',
    emailConfirmation: () => '/email-confirmation',
    verifyGoogle: () => '/verify-google-account',
    verifySlack: () => '/verify-slack-account',
    verifyYandex: () => '/verify-yandex-account',
    verifyMicrosoft: () => '/verify-microsoft-account',
  
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