import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../../shared/api/clientApi'
import { errorsHandler } from '../../../shared/lib/errors-handler'
import type {
  AdminAccess,
  AdminMember,
  AdminOrganization,
  AdminProject,
  AdminTask,
  AdminTaskStatus,
  AdminTaskTag,
  AdminUser,
  PaginatedResponse,
} from './types'
import type { PlatformRole } from '../../../shared/types/platform-role'

export const platformAdminApi = createApi({
  reducerPath: 'platformAdminApi',
  baseQuery,
  tagTypes: ['AdminUsers', 'AdminAccess', 'AdminTasks', 'AdminTaskStatuses', 'AdminTaskTags', 'AdminMembers'],
  endpoints: (builder) => ({
    getAdminAccess: builder.query<AdminAccess, void>({
      query: () => 'admin/access/',
      providesTags: ['AdminAccess'],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          errorsHandler((error as { error?: unknown })?.error)
        }
      },
    }),
    getAdminUsers: builder.query<
      PaginatedResponse<AdminUser>,
      { limit?: number; offset?: number; search?: string }
    >({
      query: ({ limit = 50, offset = 0, search }) => ({
        url: 'admin/user/',
        params: { limit, offset, ...(search ? { search } : {}) },
      }),
      providesTags: ['AdminUsers'],
    }),
    deleteAdminUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `admin/user/${userId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    updateAdminUserRole: builder.mutation<AdminUser, { userId: number; role: PlatformRole }>({
      query: ({ userId, role }) => ({
        url: `admin/user/${userId}/role/`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    getAdminMembers: builder.query<
      PaginatedResponse<AdminMember>,
      {
        limit?: number
        offset?: number
        search?: string
        type?: 'project' | 'organization'
        organization?: number
        project?: number
      }
    >({
      query: ({ limit = 50, offset = 0, search, type = 'project', organization, project }) => ({
        url: 'admin/member/',
        params: {
          limit,
          offset,
          type,
          ...(search ? { search } : {}),
          ...(organization ? { organization } : {}),
          ...(project ? { project } : {}),
        },
      }),
      providesTags: ['AdminMembers'],
    }),
    getAdminOrganizations: builder.query<
      PaginatedResponse<AdminOrganization>,
      { limit?: number; offset?: number; search?: string }
    >({
      query: ({ limit = 50, offset = 0, search }) => ({
        url: 'admin/organization/',
        params: { limit, offset, ...(search ? { search } : {}) },
      }),
    }),
    getAdminProjects: builder.query<
      PaginatedResponse<AdminProject>,
      { limit?: number; offset?: number; search?: string; organization?: number }
    >({
      query: ({ limit = 50, offset = 0, search, organization }) => ({
        url: 'admin/project/',
        params: {
          limit,
          offset,
          ...(search ? { search } : {}),
          ...(organization ? { organization } : {}),
        },
      }),
    }),
    getAdminTasks: builder.query<
      PaginatedResponse<AdminTask>,
      { limit?: number; offset?: number; search?: string; project?: number }
    >({
      query: ({ limit = 50, offset = 0, search, project }) => ({
        url: 'admin/task/',
        params: {
          limit,
          offset,
          ...(search ? { search } : {}),
          ...(project ? { project } : {}),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'AdminTasks' as const, id })),
              { type: 'AdminTasks', id: 'LIST' },
            ]
          : [{ type: 'AdminTasks', id: 'LIST' }],
    }),
    deleteAdminTask: builder.mutation<void, number>({
      query: (taskId) => ({
        url: `admin/task/${taskId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminTasks', id: 'LIST' }],
    }),
    getAdminTaskStatuses: builder.query<
      PaginatedResponse<AdminTaskStatus>,
      { limit?: number; offset?: number; project?: number }
    >({
      query: ({ limit = 50, offset = 0, project }) => ({
        url: 'admin/task-status/',
        params: { limit, offset, ...(project ? { project } : {}) },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'AdminTaskStatuses' as const, id })),
              { type: 'AdminTaskStatuses', id: 'LIST' },
            ]
          : [{ type: 'AdminTaskStatuses', id: 'LIST' }],
    }),
    deleteAdminTaskStatus: builder.mutation<void, number>({
      query: (statusId) => ({
        url: `admin/task-status/${statusId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminTaskStatuses', id: 'LIST' }],
    }),
    getAdminTaskTags: builder.query<
      PaginatedResponse<AdminTaskTag>,
      { limit?: number; offset?: number; search?: string; project?: number }
    >({
      query: ({ limit = 50, offset = 0, search, project }) => ({
        url: 'admin/task-tag/',
        params: {
          limit,
          offset,
          ...(search ? { search } : {}),
          ...(project ? { project } : {}),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'AdminTaskTags' as const, id })),
              { type: 'AdminTaskTags', id: 'LIST' },
            ]
          : [{ type: 'AdminTaskTags', id: 'LIST' }],
    }),
    deleteAdminTaskTag: builder.mutation<void, number>({
      query: (tagId) => ({
        url: `admin/task-tag/${tagId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminTaskTags', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetAdminAccessQuery,
  useGetAdminUsersQuery,
  useDeleteAdminUserMutation,
  useUpdateAdminUserRoleMutation,
  useGetAdminMembersQuery,
  useGetAdminOrganizationsQuery,
  useGetAdminProjectsQuery,
  useGetAdminTasksQuery,
  useDeleteAdminTaskMutation,
  useGetAdminTaskStatusesQuery,
  useDeleteAdminTaskStatusMutation,
  useGetAdminTaskTagsQuery,
  useDeleteAdminTaskTagMutation,
} = platformAdminApi
