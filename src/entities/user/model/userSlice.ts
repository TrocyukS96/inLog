import { createApi } from '@reduxjs/toolkit/query/react'
import type { User, UserFile, UserSettings } from './types'
import type { SocialName } from '../../../shared/types/enums'
import { baseQuery } from '../../../shared/api/clientApi'
import i18next from 'i18next'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['User', 'UserSettings', 'UserDocuments'], // для инвалидации кэша
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => 'users/me/',
      providesTags: ['User'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          
          if (data?.settings?.language) {
            const userLang = data.settings.language
            
            await i18next.changeLanguage(userLang)
            
          }
        } catch (error) {
        }
      },
    }),

    updateMe: builder.mutation<User, FormData>({
      query: (data) => ({
        url: 'users/me/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    getUserSettings: builder.query<UserSettings, void>({
      query: () => 'users/me/settings/',
      providesTags: ['UserSettings'],
    }),

    // 4. Обновить настройки (поддерживает FormData и обычный объект)
    updateUserSettings: builder.mutation<
      UserSettings,
      FormData | { language: 'ru' | 'en' } | object
    >({
      query: (data) => ({
        url: 'users/me/settings/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['UserSettings'],
    }),

    // 5. Социальный логин
    socialLogin: builder.mutation<
      { user: User; access_token: string },
      { code: string; socialName: SocialName }
    >({
      query: ({ code, socialName }) => ({
        url: `users/social-auth/${socialName}/login/`,
        method: 'PATCH',
        body: { code },
      }),
      // после успеха можно инвалидировать User
      invalidatesTags: ['User'],
    }),

    // 6. Последние участники (недавние)
    getRecentParticipants: builder.query<User[], void>({
      query: () => 'users/recent-participants/',
      providesTags: ['User'],
    }),

    // 7. Список приглашённых в проект
    getInvitationList: builder.query<User[], number>({
      query: (projectId) => `projects/${projectId}/user-invitation/`,
    }),

    // 8. Изменить роль участника (админ)
    changeRole: builder.mutation<
      unknown,
      { projectId: number; memberId: number; data: any }
    >({
      query: ({ projectId, memberId, data }) => ({
        url: `projects/${projectId}/members/${memberId}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    // 9. Удалить участника из проекта
    closeRoleAccess: builder.mutation<
      unknown,
      { projectId: number; memberId: number }
    >({
      query: ({ projectId, memberId }) => ({
        url: `projects/${projectId}/members/${memberId}/`,
        method: 'DELETE',
      }),
    }),

    // 10. Запрос изменения роли от пользователя
    changeRoleByUser: builder.mutation<
      unknown,
      { projectId: number; data: any }
    >({
      query: ({ projectId, data }) => ({
        url: `projects/${projectId}/role-request/`,
        method: 'POST',
        body: data,
      }),
    }),

    // 11. Ответ админа на запрос роли
    changeRoleAdminResponse: builder.mutation<
      unknown,
      { projectId: number; data: any }
    >({
      query: ({ projectId, data }) => ({
        url: `projects/${projectId}/role-request/response/`,
        method: 'POST',
        body: data,
      }),
    }),

    // 12. Получить документы пользователя
    getUserDocuments: builder.query<UserFile[], void>({
      query: () => 'users/me/documents/',
      providesTags: ['UserDocuments'],
    }),

    // 13. Добавить документ (FormData)
    addUserDocument: builder.mutation<Partial<UserFile>, FormData>({
      query: (data) => ({
        url: 'users/me/documents/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserDocuments'],
    }),

    // 14. Удалить документ
    deleteUserDocument: builder.mutation<void, number>({
      query: (id) => ({
        url: `users/me/documents/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserDocuments'],
    }),
  }),
})

// Экспорт хуков
export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
  useSocialLoginMutation,
  useGetRecentParticipantsQuery,
  useGetInvitationListQuery,
  useChangeRoleMutation,
  useCloseRoleAccessMutation,
  useChangeRoleByUserMutation,
  useChangeRoleAdminResponseMutation,
  useGetUserDocumentsQuery,
  useAddUserDocumentMutation,
  useDeleteUserDocumentMutation,
} = userApi