

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../shared/ui/table'
import { Button } from '../../../../shared/ui/button'
import { Calendar, FileText, FileSpreadsheet, Hash, Plus } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '../../../../shared/ui/popover'
import { DatePicker } from '../../../../shared/ui/date-picker'
import { Input } from '../../../../shared/ui/input'
import { ru } from 'date-fns/locale'
import { enUS } from 'date-fns/locale'
import { cn } from '../../../../shared/lib/utils'
import { Save, X, Edit } from 'lucide-react'
import { Textarea } from '../../../../shared/ui/textarea'
import type { AdminPanelNode } from '../../../../entities/admin/model/types'

export type ColumnType = 'text' | 'number' | 'date' | 'file'

export interface ColumnConfig {
  key: string
  title: {
    en: string
    ru: string
  }
  dataIndex: string
  inputType: ColumnType
  width?: number
}

export interface DataItem {
  key: string
  [key: string]: any
}

interface Props {
  node: AdminPanelNode
  initialColumns?: ColumnConfig[]
  initialData?: DataItem[]
}

const ConstructorTable = ({ initialColumns, initialData }: Props) => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language === 'ru' ? 'ru' : 'en'

  const dateLocale = currentLang === 'ru' ? ru : enUS

  const [columns, setColumns] = useState<ColumnConfig[]>(initialColumns || [])
  const [data, setData] = useState<DataItem[]>(initialData || [])
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})

  const formatDate = (date: Date | string | null) => {
    if (!date) return ''
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'dd.MM.yyyy', { locale: dateLocale })
  }

  const getColumnIcon = (type: ColumnType) => {
    switch (type) {
      case 'number':
        return <Hash className="h-3 w-3" />
      case 'date':
        return <Calendar className="h-3 w-3" />
      case 'file':
        return <FileText className="h-3 w-3" />
      default:
        return null
    }
  }

  const deleteRow = (key: string) => {
    setData(data.filter((item) => item.key !== key))
    if (editingKey === key) {
      cancelEdit()
    }
  }

  const deleteColumn = (columnKey: string) => {
    if (columns.length <= 1) {
      return
    }
    setColumns(columns.filter((col) => col.key !== columnKey))
  }

  const addColumn = () => {
  }

  const cancelEdit = () => {
    setEditingKey(null)
    setEditValues({})
  }

  const startEdit = (record: DataItem) => {
    const values: Record<string, any> = {}
    columns.forEach((col) => {
      values[col.dataIndex] = record[col.dataIndex] || ''
    })
    setEditValues(values)
    setEditingKey(record.key)
  }

  const saveEdit = (key: string) => {
    const newData = data.map((item) => {
      if (item.key === key) {
        return { ...item, ...editValues }
      }
      return item
    })
    setData(newData)
    setEditingKey(null)
    setEditValues({})
  }

  const updateEditValue = (dataIndex: string, value: any) => {
    setEditValues((prev) => ({ ...prev, [dataIndex]: value }))
  }

  const addRow = () => {
    const newKey = Date.now().toString()
    const newRow: DataItem = { key: newKey }
    columns.forEach((col) => {
      if (col.inputType === 'number') {
        newRow[col.dataIndex] = 0
      } else if (col.inputType === 'date') {
        newRow[col.dataIndex] = null
      } else {
        newRow[col.dataIndex] = ''
      }
    })
    setData([...data, newRow])
    startEdit(newRow)
  }

  const renderEditCell = (column: ColumnConfig, record: DataItem) => {
    const value = editValues[column.dataIndex] ?? record[column.dataIndex]

    switch (column.inputType) {
      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => updateEditValue(column.dataIndex, e.target.value)}
            className="h-8"
          />
        )
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-8 w-full justify-start text-left font-normal"
              >
                {value ? formatDate(value) : <span>{t('select-date')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <DatePicker
                value={value ? new Date(value) : undefined}
                onChange={(date) => updateEditValue(column.dataIndex, date)}
              />
            </PopoverContent>
          </Popover>
        )
      case 'file':
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-3 w-3 mr-1" />
              {t('upload-file')}
            </Button>
            {value && (
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {value.name || value}
              </span>
            )}
          </div>
        )
      default:
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => updateEditValue(column.dataIndex, e.target.value)}
            className="min-h-[60px] resize-y"
            placeholder={t('enter-text')}
          />
        )
    }
  }

  const renderViewCell = (column: ColumnConfig, record: DataItem) => {
    const value = record[column.dataIndex]

    if (!value && value !== 0) {
      return <span className="text-muted-foreground/50">—</span>
    }

    switch (column.inputType) {
      case 'date':
        return <span>{formatDate(value)}</span>
      case 'number':
        return <span>{value}</span>
      case 'file':
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate max-w-[150px]">
              {typeof value === 'object' ? value.name : value}
            </span>
          </div>
        )
      default:
        return (
          <div className="whitespace-pre-wrap break-words max-w-[300px]">
            {value}
          </div>
        )
    }
  }

  const isEditing = (key: string) => editingKey === key


  return (
    <div className="w-full">
      <div className="rounded-md border border-border/50 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{ minWidth: column.width || 150 }}
                  className="h-10"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {getColumnIcon(column.inputType)}
                      <span className="font-medium text-sm">
                        {column.title[currentLang]}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => deleteColumn(column.key)}
                      disabled={columns.length <= 1}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-[100px] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addColumn}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {t('buttons.add-column')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="h-8 w-8 opacity-50" />
                    <span>{t('errors.no-data')}</span>
                    <Button variant="outline" size="sm" onClick={addRow}>
                      <Plus className="h-3 w-3 mr-1" />
                      {t('buttons.add-row')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => {
                const editing = isEditing(record.key)
                return (
                  <TableRow
                    key={record.key}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      editing && "bg-muted/20"
                    )}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        style={{ minWidth: column.width || 150 }}
                        className="py-2"
                      >
                        {editing
                          ? renderEditCell(column, record)
                          : renderViewCell(column, record)}
                      </TableCell>
                    ))}
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        {editing ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => saveEdit(record.key)}
                              className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <Save className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={cancelEdit}
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(record)}
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={!!editingKey}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRow(record.key)}
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                              disabled={!!editingKey}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={addRow}
            disabled={!!editingKey}
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('buttons.add-row')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ConstructorTable