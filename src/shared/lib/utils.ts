import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { TaskPriority } from "../../entities/task/model/types"
import { priorityColorStyles } from "../config/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPriorityColorStyle = (priority: TaskPriority,type: 'background' | 'border' | 'text' | 'fill') => {
  if (type === 'background') {
    return {
      backgroundColor: priorityColorStyles[priority],
    }
  } else if (type === 'border') {
    return {
      borderColor: priorityColorStyles[priority],
    }
  } else if (type === 'text') {
    return {
      color: priorityColorStyles[priority],
    }
  } else if (type === 'fill') {
    return {
      fill: priorityColorStyles[priority],
    }
  }
}