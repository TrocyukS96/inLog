import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../shared/api/clientApi";
import type { Task, TasksFilterParams } from "./types";
import type { TaskCreate, TaskUpdate } from "../../../shared/types/dto/task";

export const taskApi = createApi({
    reducerPath: 'taskApi',
    baseQuery,
    tagTypes: ['Task'],
    endpoints: (builder) => ({
        getTasks: builder.query<{
            count: number
            next: string | null
            previous: string | null
            results: Task[]
        }, { projectId: number; params: Partial<TasksFilterParams> }>({
            query: ({ projectId, params }) => ({
                url: `projects/${projectId}/tasks/task/`,
                params: params,
            }),
            providesTags: ['Task'],
        }),

        getTask: builder.query<Task, { projectId: number; taskSlug: string }>({
            query: ({ projectId, taskSlug }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/`,
            }),
            providesTags: ['Task'],
        }),

        updateTask: builder.mutation<Task, { projectId: number; taskSlug: string; data: TaskUpdate }>({
            query: ({ projectId, taskSlug, data }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),

        createTask: builder.mutation<Task, { projectId: number; data: Pick<TaskCreate, 'name'> & Partial<Omit<TaskCreate, 'name'>> }>({
            query: ({ projectId, data }) => ({
                url: `projects/${projectId}/tasks/task/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),

        deleteTask: builder.mutation<void, { projectId: number; taskSlug: string }>({
            query: ({ projectId, taskSlug }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),

        getStatuses: builder.query<unknown[], { projectId: number }>({
            query: ({ projectId }) => `projects/${projectId}/statuses/`,
        }),
    }),

});

export const { useGetTasksQuery, useGetTaskQuery, useUpdateTaskMutation, useCreateTaskMutation, useDeleteTaskMutation, useGetStatusesQuery } = taskApi;