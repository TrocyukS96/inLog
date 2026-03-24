import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from '../../../shared/api/clientApi'
import type { AdminPanelGroup, AdminPanelGroupRequest, AdminPanelNode, AdminPanelNodeRequest, AdminPanelNodeTab } from "./types"

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery,
    tagTypes: ['Admin'],
    endpoints: (builder) => ({
        getAdminPanelNodes: builder.query<AdminPanelNode[], { organizationId: number }>({
            query: ({ organizationId }) => `organizations/${organizationId}/structure-element-group/`,
            providesTags: ['Admin']
        }),
        getAdminPanelNodeById: builder.query<AdminPanelNode, { organizationId: number, nodeId: number }>({
            query: ({ organizationId, nodeId }) => `organizations/${organizationId}/structure-element-group/${nodeId}/`,
            providesTags: ['Admin']
        }),
        addAdminPanelNode: builder.mutation<AdminPanelNode, { organizationId: number, body: AdminPanelNodeRequest }>({
            query: ({ organizationId, body }) => ({
                url: `organizations/${organizationId}/structure-element-group/`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Admin']
        }),
        updateAdminPanelNode: builder.mutation<AdminPanelNode, { organizationId: number, nodeId: number, body: AdminPanelNodeRequest }>({
            query: ({ organizationId, nodeId, body }) => ({
                url: `organizations/${organizationId}/structure-element-group/${nodeId}/`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Admin']
        }),
        deleteAdminPanelNode: builder.mutation<void, { organizationId: number, nodeId: number }>({
            query: ({ organizationId, nodeId }) => `organizations/${organizationId}/structure-element-group/${nodeId}/`,
            invalidatesTags: ['Admin']
        }),

        getAdminPanelNodeTabs: builder.query<AdminPanelNodeTab[], { organizationId: number }>({
            query: ({ organizationId }) => `organizations/${organizationId}/structure-element/`,
            providesTags: ['Admin']
        }),
        updateAdminPanelNodeTabs: builder.mutation<AdminPanelNodeTab, { organizationId: number, body: AdminPanelNodeTab }>({
            query: ({ organizationId, body }) => ({
                url: `organizations/${organizationId}/structure-element/multiple-update/`,
                method: 'PATCH',
                body: { ...body, organizationId },
            }),
            invalidatesTags: ['Admin']
        }),
        deleteAdminPanelNodeTab: builder.mutation<void, { organizationId: number, tabId: number }>({
            query: ({ organizationId, tabId }) => ({
                url: `organizations/${organizationId}/structure-element/${tabId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Admin']
        }),
        getAdminPanelGroups: builder.query<AdminPanelGroup[], { group?: number, structure_element?: number, organizationId?: number }>({
            query: ({ group, structure_element, organizationId }) => ({
                url: `organizations/${organizationId}/structure-element-field/`,
                params: { group, structure_element },
            }),
            providesTags: ['Admin']
        }),
        addAdminPanelGroup: builder.mutation<AdminPanelGroup, { organizationId: number, body: AdminPanelGroupRequest }>({
            query: ({ organizationId, body }) => ({
                url: `organizations/${organizationId}/structure-element-field/`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Admin']
        }),
        deleteAdminPanelGroup: builder.mutation<void, { organizationId: number, groupId: number }>({
            query: ({ organizationId, groupId }) => ({
                url: `organizations/${organizationId}/structure-element-field/${groupId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Admin']
        }),
    })
})

export const {
    useGetAdminPanelNodesQuery,
    useGetAdminPanelNodeByIdQuery,
    useAddAdminPanelNodeMutation,
    useUpdateAdminPanelNodeMutation,
    useDeleteAdminPanelNodeMutation,
    useGetAdminPanelNodeTabsQuery,
    useUpdateAdminPanelNodeTabsMutation,
    useDeleteAdminPanelNodeTabMutation,
    useGetAdminPanelGroupsQuery,
    useAddAdminPanelGroupMutation,
    useDeleteAdminPanelGroupMutation
} = adminApi;