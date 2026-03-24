import { toast } from 'sonner'

// Тип для типичной ошибки от твоего бэкенда
interface BackendErrorResponse {
  detail?: string
  messages?: string[]
  fieldsErrors?: Array<{ field: string; message: string }>
  [key: string]: any
}

// Проверяем, является ли ошибка от RTK Query
function isRTKQueryError(error: unknown): error is { status: number; data: BackendErrorResponse } {
  return (error as any).status && (error as any).data
}

export const errorsHandler = (
  error: unknown,
  t: any = (key: string) => key // fallback, если t не передан
) => {

  // 1. Сетевые ошибки или таймауты
  if (error instanceof Error && error.message === 'Network Error') {
    toast.error(t('errors.network-error'))
    return
  }

  // 2. Ошибки RTK Query / Fetch
  if (isRTKQueryError(error)) {
    const { status, data } = error

    // Общие серверные ошибки без детализации
    if ([404, 500, 405].includes(Number(status)) && !data?.detail) {
      toast.error(t('errors.server-error'))
      return
    }

    // 3. Ошибка с detail (самый частый случай)
    if (data?.detail) {
      toast.error(data.detail)
      return
    }

    // 4. Ошибки в messages (массив строк)
    if (data?.messages?.length) {
      data.messages.forEach((msg: string) => {
        toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg))
      })
      return
    }

    // 5. Field-specific ошибки (fieldsErrors или просто объект { field: ['msg'] })
    if (data?.fieldsErrors?.length) {
      data.fieldsErrors.forEach((err: { field: string; message: string }) => {
        toast.error(`${err.field}: ${err.message}`)
      })
      return
    }

    // 6. Объект с полями-ошибками (старый формат { email: ['invalid'] })
    if (typeof data === 'object' && data !== null) {
      Object.entries(data).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg) => {
            toast.error(`${field}: ${msg}`)
          })
        } else if (typeof messages === 'string') {
          toast.error(`${field}: ${messages}`)
        }
      })
      return
    }

    // 7. Последний fallback
    toast.error(t('errors.something-went-wrong'))
    return
  }

  // 8. Любая другая неизвестная ошибка
  toast.error(t('errors.something-went-wrong'))
}