import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../app/store/store'
import { userApi } from './userSlice'
import type { User } from './types'

// Базовый селектор на весь userApi slice (RTK Query хранит данные в state[userApi.reducerPath])
const selectUserApiSlice = (state: RootState) => state[userApi.reducerPath]

// 1. Данные пользователя из RTK Query (query getMe)
export const selectUser = createSelector(
  selectUserApiSlice,
  (slice) => slice.queries?.['getMe(undefined)']?.data as User | undefined
)

// 2. Статус загрузки getMe
export const selectUserIsLoading = createSelector(
  selectUserApiSlice,
  (slice) => slice.queries?.['getMe(undefined)']?.status === 'pending'
)

// 3. Ошибка загрузки getMe
export const selectUserError = createSelector(
  selectUserApiSlice,
  (slice) => slice.queries?.['getMe(undefined)']?.error
)

// 4. Настройки пользователя (если они в user)
export const selectUserSettings = createSelector(
  selectUser,
  (user) => user?.settings
)

// 5. Язык интерфейса
export const selectUserLanguage = createSelector(
  selectUserSettings,
  (settings) => settings?.language || 'ru'
)

// 6. Полное имя пользователя (вычисляемое)
export const selectUserFullName = createSelector(
  selectUser,
  (user) =>
    user
      ? [user.firstName, user.middleName, user.lastName]
          .filter(Boolean)
          .join(' ')
      : ''
)

// 7. Аватар
export const selectUserAvatar = createSelector(selectUser, (user) => user?.avatar)

// 8. Роль пользователя
export const selectUserRole = createSelector(selectUser, (user) => user?.role)

// 9. Глобальный статус авторизации (если хранишь в authSlice)
// export const selectIsAuthenticated = createSelector(
//   (state: RootState) => state.auth?.isLoggedIn, // если у тебя есть authSlice
//   (isLoggedIn) => !!isLoggedIn
// )

// Альтернатива: если авторизация определяется наличием токена + user
export const selectIsAuthenticatedAlternative = createSelector(
  selectUser,
  () => !!sessionStorage.getItem('ACCESS_TOKEN'),
  (user, hasToken) => !!user && hasToken
)