
import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../../features/auth/model/authSlice'
import { userApi } from '../../entities/user/model/userSlice'
import { organizationApi } from '../../entities/organization/model/organizationSlice'
import { projectApi } from '../../entities/project/model/projectSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      organizationApi.middleware,
      projectApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch