import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "../../../shared/api/clientApi"
import type { OrganizationRequest, OrganizationResponse } from "../../../shared/types/dto/organization"
import type { Organization } from "./types"

export const organizationApi = createApi({
    reducerPath: 'organizationApi',
    baseQuery,
    tagTypes: ['Organization'],
    endpoints: (builder) => ({
        getOrganizations: builder.query<Organization[], void>({
            query: () => 'organizations/organization/',
            transformResponse: (response: any) => {
              if (!response || !Array.isArray(response)) return []
      
              return response.map((el: any) => ({
                fullName: el?.full_name,
                shortName: el?.short_name,
                address: el?.address,
                id: el?.id,
              })) as Organization[]
            },
            providesTags: ['Organization'],
          }),
          addOrganization: builder.mutation<OrganizationResponse, OrganizationRequest>({
            query: (data) => ({
              url: 'organizations/organization/',
              method: 'POST',
              body: data,
            }),
            invalidatesTags: ['Organization'],
          }),
          deleteOrganization: builder.mutation<void, number>({
            query: (id) => ({
              url: `organizations/organization/${id}/`,
              method: 'DELETE',
            }),
            invalidatesTags: ['Organization'],
          }),
    }),
})

export const { useGetOrganizationsQuery, useAddOrganizationMutation, useDeleteOrganizationMutation } = organizationApi