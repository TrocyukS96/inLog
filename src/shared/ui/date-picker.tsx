"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Label } from "./label"
import { DATE_VIEW_FORMAT } from "../config/constants"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  calendarClassName?: string
  id?: string
  defaultMonth?: Date
  fromYear?: number
  toYear?: number
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Выберите дату",
  label,
  disabled = false,
  className,
  triggerClassName,
  calendarClassName,
  id = "date-picker",
  defaultMonth,
  fromYear,
  toYear,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [isOpen, setIsOpen] = React.useState(false)

  // Синхронизация внешнего value
  React.useEffect(() => {
    setDate(value)
  }, [value])

  // Внутренний обработчик изменения
  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate)
  }

  const handleApply = () => {
    onChange?.(date)
    setIsOpen(false)
  }

  const handleClear = () => {
    setDate(undefined)
    onChange?.(undefined)
    setIsOpen(false)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen} >
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal px-3 bg-transparent",
              !date && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              triggerClassName
            )}
            disabled={disabled}
          >
            <CalendarIcon className={`h-4 w-4 transition-colors text-muted-foreground ${isOpen && "text-primary"}`} />
            {date ? (
              format(date, DATE_VIEW_FORMAT)
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-background" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              defaultMonth={defaultMonth ?? date}
              className={cn("w-full", calendarClassName)}
              fromYear={fromYear}
              toYear={toYear}
              initialFocus
              style={{
                width: '200px', // Фиксированная ширина для одного месяца
              }}
            />
          </div>
          <div className="flex items-center justify-end gap-2 p-2 pt-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClear}
              className="h-8 px-3"
            >
              Очистить
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleApply}
              className="h-8 px-3"
            >
              Применить
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}