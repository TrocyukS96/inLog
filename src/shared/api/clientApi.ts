import { fetchBaseQuery } from "@reduxjs/toolkit/query"

export const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      const tokenRaw = sessionStorage.getItem('ACCESS_TOKEN')
      const token = tokenRaw ? JSON.parse(tokenRaw) : null
  
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
  
      headers.set('Content-Type', 'application/json')
  
      return headers
    },
  })