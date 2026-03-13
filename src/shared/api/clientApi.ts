import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { ACCESS_TOKEN } from "../config/constants"
import { routes } from "../lib/routes"

export const baseQueryStart = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const tokenRaw = localStorage.getItem(ACCESS_TOKEN)
      const token = tokenRaw ? JSON.parse(tokenRaw) : null

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  })

  let isRedirecting = false

  export const baseQuery: typeof baseQueryStart = async (
    args,
    api,
    extraOptions
  ) => {
    const result = await baseQueryStart(args, api, extraOptions)
  
    if (result.error && result.error.status === 401) {
  
      if (!isRedirecting) {
        isRedirecting = true
  
        localStorage.removeItem(ACCESS_TOKEN)
  
        window.location.replace(routes.login())
      }
    }
  
    return result
  }