
import { configureStore } from '@reduxjs/toolkit'
import { authApi } from '../../features/auth/model/authSlice'
import { userApi } from '../../entities/user/model/userSlice'
import { organizationApi } from '../../entities/organization/model/organizationSlice'
import { projectApi } from '../../entities/project/model/projectSlice'
import { taskApi } from '../../entities/task/model/taskSlice'
import { adminApi } from '../../entities/admin/model/adminSlice'
import { notificationApi } from '../../entities/notification/model/notificationSlice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      organizationApi.middleware,
      projectApi.middleware,
      taskApi.middleware,
      adminApi.middleware,
      notificationApi.middleware,
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch