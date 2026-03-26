import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { ACCESS_TOKEN } from "../config/constants"
import { routes } from "../lib/routes"
import { toast } from "sonner"
import { t } from "i18next"

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

      console.log(result.error,'--result.error')
  
      if (!isRedirecting) {
        isRedirecting = true
  
        localStorage.removeItem(ACCESS_TOKEN)

        toast.error(t('errors.session-expired'))
  
        window.location.replace(routes.login())
      }
    }
  
    return result
  }