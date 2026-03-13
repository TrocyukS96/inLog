'use client'

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "../../shared/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../shared/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shared/ui/popover"
import { Badge } from "../../shared/ui/badge"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  options: { label: string; value: string }[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  renderOption?: (option: MultiSelectOption) => React.ReactNode
}

export function MultiSelect({
  options = [],
  value = [],
  onValueChange,
  placeholder = "Выберите элементы...",
  disabled = false,
  className,
  renderOption,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    
    onValueChange?.(newValue)
  }

  const handleRemove = (optionValue: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const newValue = value.filter((v) => v !== optionValue)
    onValueChange?.(newValue)
  }

  const getOptionLabel = (optionValue: string) => {
    const option = options.find((opt) => opt.value === optionValue)
    return option?.label || optionValue
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-auto min-h-10 px-3 py-2",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1 mr-2">
            {value.length > 0 ? (
              value.map((itemValue) => (
                <Badge
                  key={itemValue}
                  variant="secondary"
                  className="mr-1 mb-1"
                >
                  {getOptionLabel(itemValue)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={(e) => handleRemove(itemValue, e)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandEmpty>Ничего не найдено</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleToggle(option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      value.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {value.includes(option.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  {renderOption ? renderOption(option) : option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}