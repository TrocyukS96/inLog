import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../../app/store/store'
import { ACCESS_TOKEN } from '../../../shared/config/constants'
import { notificationApi } from './notificationSlice'
import type { Notification } from './types'
import { getNotificationsWsUrl } from '../lib/get-notifications-ws-url'

const RECONNECT_DELAY_MS = 5000

export function useNotificationsWebSocket(enabled = true) {
  const dispatch = useDispatch<AppDispatch>()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) return

    const tokenRaw = localStorage.getItem(ACCESS_TOKEN)
    if (!tokenRaw) return

    let token: string
    try {
      token = JSON.parse(tokenRaw) as string
    } catch {
      return
    }

    const connect = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return

      const ws = new WebSocket(getNotificationsWsUrl(token))
      wsRef.current = ws

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as Notification
          if (!message || message.is_deleted || message.deleted) return

          dispatch(
            notificationApi.util.updateQueryData('getNotifications', undefined, (draft) => {
              const existingIndex = draft.findIndex((item) => item.id === message.id)
              if (existingIndex >= 0) {
                draft[existingIndex] = message
                return
              }

              draft.unshift(message)
            })
          )
        } catch {
          // Ignore malformed websocket payloads.
        }
      }

      ws.onclose = () => {
        wsRef.current = null
        reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY_MS)
      }

      ws.onerror = () => {
        ws.close()
      }
    }

    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      wsRef.current?.close()
      wsRef.current = null
    }
  }, [dispatch, enabled])
}
