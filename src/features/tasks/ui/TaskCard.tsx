import { MoreHorizontal, Trash2, Copy } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../shared/ui/dropdown-menu'
import { Button } from '../../../shared/ui/button'
import { cn } from '../../../shared/lib/utils'
import { useTranslation } from 'react-i18next'

import type { Task } from '../../../entities/task/model/types'

interface TaskCardProps {
    task: Task
    getTask: (task: Task) => void
    deleteTask: (task: Task) => void
    createTemplate: (task: Task) => void
    isActive?: boolean
}

const TaskCard = ({
    task,
    getTask,
    deleteTask,
    createTemplate,
    isActive = false,
}: TaskCardProps) => {
    const { t } = useTranslation()

    const priorityTypes = {
        low: 'low',
        medium: 'medium',
        high: 'high',
        critical: 'critical',
        important: 'important',
    }

    const priorityColor = {
        [priorityTypes.low]: 'bg-green-500',
        [priorityTypes.medium]: 'bg-yellow-500',
        [priorityTypes.high]: 'bg-orange-500',
        [priorityTypes.critical]: 'bg-red-500',
        [priorityTypes.important]: 'bg-yellow-500',
    }

    return (
        <div
            onClick={() => getTask(task)}
            className={cn(
                "group relative flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer bg-card",
                isActive
                    ? "border-primary shadow-sm"
                    : "border-border hover:border-primary/50",
                // style.bg
            )}
        >
            {/* Цветная точка слева */}
            <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg" style={{ backgroundColor: priorityColor[task.priority] }} />

            {/* Основной контент */}
            <div className="flex items-center gap-4 flex-1 pl-3">
                <div className="flex flex-col">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {task.name}
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {/* <span className={cn("font-medium", style.text)}>
              {t(`fields.${task.priority.toLowerCase()}`)}
            </span>
            {task.due_date_end && (
              <span>
                {t('due')}: {new Date(task.due_date_end).toLocaleDateString()}
              </span>
            )} */}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end">
                {task.due_date_end && (
                    <span className="text-base text-muted-foreground">
                        {new Date(task.due_date_end).toLocaleDateString()}
                    </span>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deleteTask(task)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('tasks-page.delete-task')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => createTemplate(task)}>
                            <Copy className="h-4 w-4 mr-2" />
                            {t('tasks-page.create-template')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Меню 3 точки */}

        </div>
    )
}

export default TaskCard