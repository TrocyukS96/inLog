import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../shared/api/clientApi";
import type { TagsResponse, TaskCreate, TaskUpdate } from "../../../shared/types/dto/task";
import type { Status, Task, TasksFilterParams } from "./types";

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
                params: { ...params },
            }),
            // providesTags: (result) =>
            //     result
            //       ? [
            //           ...result.results.map((task) => ({ type: 'Task' as const, id: task.slug })),
            //           { type: 'Task', id: 'LIST' },
            //         ]
            //       : [{ type: 'Task', id: 'LIST' }],
            providesTags: ['Task'],
        }),

        getTask: builder.query<Task, { projectId: number; taskSlug: string }>({
            query: ({ projectId, taskSlug }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/`,
            }),
            providesTags: ['Task'],
        }),

        updateTask: builder.mutation<Task, { projectId: number; taskSlug: string; data: { id?: number, parent?: number } & Partial<TaskUpdate> }>({
            query: ({ projectId, taskSlug, data }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/`,
                method: 'PATCH',
                body: data,
            }),
            // invalidatesTags: (_, __, { taskSlug }) => [{ type: 'Task', id: taskSlug }],
            invalidatesTags: ['Task'],
        }),

        AddTaskDoer: builder.mutation<Task, { projectId: number; taskSlug: string; data: { user: number } }>({
            query: ({ projectId, taskSlug, data }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/doer/`,
                method: 'POST',
                body: {
                    user: data.user,
                    project: projectId,
                },
            }),
            // invalidatesTags: (_, __, { taskSlug }) => [{ type: 'Task', id: taskSlug }],
        }),
        deleteTaskDoer: builder.mutation<Task, { projectId: number; taskSlug: string, doerId: number }>({
            query: ({ projectId, taskSlug, doerId }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/doer/${doerId}/`,
                method: 'DELETE',
            }),
            // invalidatesTags: (_, __, { taskSlug }) => [{ type: 'Task', id: taskSlug }],
        }),
        AddTaskSupervisor: builder.mutation<Task, { projectId: number; taskSlug: string; data: { user: number } }>({
            query: ({ projectId, taskSlug, data }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/supervisor/`,
                method: 'POST',
                body: {
                    user: data.user,
                    project: projectId,
                },
            }),
            // invalidatesTags: (_, __, { taskSlug }) => [{ type: 'Task', id: taskSlug }],
        }),
        deleteTaskSupervisor: builder.mutation<Task, { projectId: number; taskSlug: string, supervisorId: number }>({
            query: ({ projectId, taskSlug, supervisorId }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/supervisor/${supervisorId}/`,
                method: 'DELETE',
            }),
        }),

        createTask: builder.mutation<Task, { projectId: number; data: Pick<TaskCreate, 'name'> & Partial<Omit<TaskCreate, 'name'>> }>({
            query: ({ projectId, data }) => ({
                url: `projects/${projectId}/tasks/task/`,
                method: 'POST',
                body: data,
            }),
            // invalidatesTags: (_, __, { projectId }) => [{ type: 'Task', id: projectId }],
            invalidatesTags: ['Task'],
        }),

        deleteTask: builder.mutation<void, { projectId: number; taskSlug: string }>({
            query: ({ projectId, taskSlug }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/`,
                method: 'DELETE',
            }),
            // invalidatesTags: ['Task'],
        }),

        getStatuses: builder.query<Status[], { projectId: number }>({
            query: ({ projectId }) => `projects/${projectId}/tasks/status/`,
        }),
        getTaskTags: builder.query<TagsResponse, { projectId: number, limit?: number, is_orphan?: boolean }>({
            query: ({ projectId, limit, is_orphan }) => `projects/${projectId}/tasks/tag/?limit=${limit}&is_orphan=${is_orphan}`,
        }),
        addTaskTag: builder.mutation<Task, { projectId: number, data: { name: string } }>({
            query: ({ projectId, data }) => ({
                url: `projects/${projectId}/tasks/tag/`,
                method: 'POST',
                body: data,
            }),
            // invalidatesTags: ['Task'],
        }),
        addTaskComment: builder.mutation<Comment, { projectId: number, taskSlug: string, data: { text: string } }>({
            query: ({ projectId, taskSlug, data }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/comment/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),
        editTaskComment: builder.mutation<Comment, { projectId: number, taskSlug: string, commentId: number, data: { text: string } }>({
            query: ({ projectId, taskSlug, commentId, data }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/comment/${commentId}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Task'],
        }),
        deleteTaskComment: builder.mutation<void, { projectId: number, taskSlug: string, commentId: number }>({
            query: ({ projectId, taskSlug, commentId }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/comment/${commentId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Task'],
        }),
        createTaskFile: builder.mutation<Task['files'][number], { projectId: number, taskSlug: string, file: File }>({
            query: ({ projectId, taskSlug, file }) => {
                const formData = new FormData()
                formData.append('file', file)
                return {
                    url: `projects/${projectId}/tasks/task/${taskSlug}/file/`,
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            },

            // invalidatesTags: ['Task'],
        }),
        deleteTaskFile: builder.mutation<void, { projectId: number, taskSlug: string, fileId: number }>({
            query: ({ projectId, taskSlug, fileId }) => ({
                url: `projects/${projectId}/tasks/task/${taskSlug}/file/${fileId}/`,
                method: 'DELETE',
            }),
            // invalidatesTags: ['Task'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useGetTaskQuery,
    useUpdateTaskMutation,
    useCreateTaskMutation,
    useDeleteTaskMutation,
    useGetStatusesQuery,
    useAddTaskDoerMutation,
    useDeleteTaskDoerMutation,
    useAddTaskSupervisorMutation,
    useDeleteTaskSupervisorMutation,
    useAddTaskTagMutation,
    useGetTaskTagsQuery,
    useAddTaskCommentMutation,
    useEditTaskCommentMutation,
    useDeleteTaskCommentMutation,
    useCreateTaskFileMutation,
    useDeleteTaskFileMutation,
} = taskApi;


