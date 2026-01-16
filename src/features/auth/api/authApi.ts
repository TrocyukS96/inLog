// src/features/auth/api/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  PasswordResetConfirmRequest,
  PasswordResetConfirmResponse,
  ConfirmEmailChangeRequest,
  // ... остальные типы — если они пока только для auth, можно держать здесь
  // или вынести в src/shared/types/response.ts / request.ts
} from '../../../shared/types/dto/auth'   // ← подкорректируй путь, если типы уже в shared

// или если типы пока в старом месте
// from '@/features/auth/model/types'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/',
  credentials: 'include', // withCredentials: true → куки отправляются автоматически
  prepareHeaders: (headers) => {
    const tokenRaw = sessionStorage.getItem('ACCESS_TOKEN')
    const token = tokenRaw ? JSON.parse(tokenRaw) : null

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    headers.set('Content-Type', 'application/json')
    // 'Access-Control-Allow-Origin': '*' — обычно не нужно на клиенте, это серверный заголовок

    return headers
  },
})

export const authApi = createApi({
  reducerPath: 'authApi', // уникальное имя для reducer в store
  baseQuery,
  endpoints: (builder) => ({
    // Регистрация (использует чистый axios в старом коде → теперь mutation)
    register: builder.mutation<RegistrationResponse, RegistrationRequest>({
      query: (data) => ({
        url: 'auth/registration/',
        method: 'POST',
        body: data,
      }),
    }),

    // Логин
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: 'auth/login/',
        method: 'POST',
        body: data,
      }),
      // Автоматически сохраняем токен после успешного логина
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // предполагаем, что в ответе есть access_token или token
          if (data?.access_token) {
            sessionStorage.setItem('ACCESS_TOKEN', JSON.stringify(data.access_token))
          }
          // можно добавить: dispatch(setUser(data.user)) если есть user в ответе
        } catch {}
      },
    }),

    // Выход
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout/',
        method: 'POST',
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          sessionStorage.removeItem('ACCESS_TOKEN')
          // можно очистить другие данные в store, если есть authSlice
        } catch {}
      },
    }),

    // Проверка токена
    verifyToken: builder.mutation<{ token: string }, { token: string }>({
      query: (data) => ({
        url: 'auth/token/verify/',
        method: 'POST',
        body: data,
      }),
    }),

    // Сброс пароля
    passwordReset: builder.mutation<{ email: string; detail?: string }, { email: string }>({
      query: (data) => ({
        url: 'auth/password/reset/',
        method: 'POST',
        body: data,
      }),
    }),

    passwordResetConfirm: builder.mutation<
      PasswordResetConfirmResponse,
      PasswordResetConfirmRequest
    >({
      query: (data) => ({
        url: 'auth/password/reset/confirm/',
        method: 'POST',
        body: data,
      }),
    }),

    // Подтверждение email
    verifyEmail: builder.mutation<
      { key: string; uid?: string; detail?: any },
      { key: string; uid?: string }
    >({
      query: (data) => ({
        url: 'auth/registration/verify-email/',
        method: 'POST',
        body: data,
      }),
    }),

    // Повторная отправка email
    resendEmail: builder.mutation<
      { email: string; detail?: string },
      { email: string }
    >({
      query: (data) => ({
        url: 'auth/registration/resend-email/',
        method: 'POST',
        body: data,
      }),
    }),

    // Подтверждение смены email (использует instance → авторизованный запрос)
    confirmEmailChange: builder.mutation<
      { detail: any },
      ConfirmEmailChangeRequest
    >({
      query: (data) => ({
        url: 'users/me/confirm-email-change/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

// Экспорт хуков — это то, чем будешь пользоваться в компонентах
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyTokenMutation,
  usePasswordResetMutation,
  usePasswordResetConfirmMutation,
  useVerifyEmailMutation,
  useResendEmailMutation,
  useConfirmEmailChangeMutation,
} = authApi