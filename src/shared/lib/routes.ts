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

    organizations: {
      new: () => '/new-organization',
      list: () => '/organizations',
      detail: (id: string | number) => `/organizations/${id}`,
    },

    projects: {
      new: () => '/new-project',
      list: () => '/projects',
    },

    scheduler: {
      list: () => '/scheduler',
      tasks: () => '/scheduler/tasks',
      task: (slug: string) => `/scheduler/tasks/${slug}`,
      templates: () => '/scheduler/templates',
      statuses: () => '/scheduler/statuses',
      roadmap: () => '/scheduler/roadmap',
    },

    admin: {
      list: () => '/admin',
      constructor: () => '/admin/constructor',
      reports: () => '/admin/reports',
    },

    settings: {
      list: () => '/settings',
      profile: () => '/settings/profile',
      organizationsAndProjects: () => '/settings/organizations-and-projects',
      notifications: () => '/settings/notifications',
    },

    geoMechanics: {
      list: () => '/geo-mechanics',
    },

    // 404
    notFound: () => '*',
  } as const;
  
  // Тип для автодополнения (опционально, но очень полезно)
  export type RouteKeys = typeof routes;