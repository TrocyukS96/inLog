import { serializeAsJSON } from '@excalidraw/excalidraw'
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types'
import { useCallback, useEffect, useRef } from 'react'
import { WHITEBOARD_SAVE_DEBOUNCE_MS, WHITEBOARD_STORAGE_PREFIX } from '../lib/constants'
import type { WhiteboardScene } from './types'

const getStorageKey = (storageKey: string) => `${WHITEBOARD_STORAGE_PREFIX}${storageKey}`

export const loadWhiteboardScene = (storageKey: string): WhiteboardScene | null => {
  try {
    const raw = localStorage.getItem(getStorageKey(storageKey))
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)

    if (!parsed?.elements) {
      return null
    }

    return {
      elements: parsed.elements,
      appState: parsed.appState ?? {},
      files: parsed.files ?? {},
    }
  } catch {
    return null
  }
}

export const saveWhiteboardScene = (
  storageKey: string,
  api: ExcalidrawImperativeAPI,
) => {
  const elements = api.getSceneElements()
  const appState = api.getAppState()
  const files = api.getFiles()

  const serialized = serializeAsJSON(elements, appState, files, 'local')
  localStorage.setItem(getStorageKey(storageKey), serialized)
}

export const useWhiteboardStorage = (storageKey: string) => {
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const initialData = loadWhiteboardScene(storageKey)

  const scheduleSave = useCallback(() => {
    if (!apiRef.current) {
      return
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (apiRef.current) {
        saveWhiteboardScene(storageKey, apiRef.current)
      }
    }, WHITEBOARD_SAVE_DEBOUNCE_MS)
  }, [storageKey])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const setApi = useCallback((api: ExcalidrawImperativeAPI) => {
    apiRef.current = api
  }, [])

  return {
    initialData,
    setApi,
    scheduleSave,
  }
}
