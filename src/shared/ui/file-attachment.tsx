'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { Button } from './button'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { Download, Eye, Trash2, File as FileIcon, Upload } from 'lucide-react'
import { cn } from '../lib/utils'
import { imageExtensions } from '../config/constants'

interface IFile {
  id: number
  file: string
  filename: string
}

interface Props {
  files?: IFile[]
  title?: string
  onUpload?: (file: File) => void
  onDelete?: (id: number) => void
}

export function FileAttachment({
  files = [],
  title,
  onUpload,
  onDelete,
}: Props) {
  const { t } = useTranslation()

  const [isDragging, setIsDragging] = useState(false)

  const [preview, setPreview] = useState<{
    open: boolean
    file?: string
    name?: string
  }>({ open: false })

  const handleUploadFiles = (fileList: FileList | null) => {
    if (!fileList) return

    Array.from(fileList).forEach((file) => {
      onUpload?.(file)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUploadFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    handleUploadFiles(e.dataTransfer.files)
  }

  const isImage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    return imageExtensions.includes(ext || '')
  }

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Upload / Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-6 text-sm transition',
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:bg-muted'
        )}
      >
        <Upload className="w-4 h-4" />

        <span>
          {title ?? ( isDragging ? t('fields.drag-file') : t('fields.upload-file-or-drag-it-here'))}
        </span>

        <input
          type="file"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleInputChange}
        />
      </div>

      {/* Files list */}
      {files.length > 0 && (
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {files.map((file) => {
            const filename = file.filename.split('/').at(-1) || 'file'

            return (
              <li
                key={file.id}
                className="relative group flex flex-col items-center justify-center rounded-md border p-3 bg-muted/40 hover:bg-muted transition"
              >
                {/* preview */}
                <div className="flex items-center justify-center h-16">
                  {isImage(filename) ? (
                    <img
                      src={file.file}
                      alt={filename}
                      className="max-h-16 object-contain"
                    />
                  ) : (
                    <FileIcon className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>

                <p className="mt-2 text-xs text-center truncate w-full">
                  {filename}
                </p>

                {/* actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 bg-black/40 rounded-md transition">
                  {isImage(filename) ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() =>
                            setPreview({
                              open: true,
                              file: file.file,
                              name: filename,
                            })
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('buttons.preview')}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() =>
                            downloadFile(file.file, filename)
                          }
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {t('buttons.download')}
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete?.(file.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('buttons.delete')}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Preview dialog */}
      <Dialog
        open={preview.open}
        onOpenChange={(open) => setPreview({ open })}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview.name}</DialogTitle>
          </DialogHeader>

          {preview.file && (
            <img
              src={preview.file}
              alt={preview.name}
              className="w-full object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}