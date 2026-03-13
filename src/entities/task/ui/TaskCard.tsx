import { Copy, MoreHorizontal, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, getPriorityColorStyle } from '../../../shared/lib/utils'
import { Button } from '../../../shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../shared/ui/dropdown-menu'

import type { Task } from '../model/types'

interface TaskCardProps {
    task: Task
    selectTask: (task: Task) => void
    deleteTask: (task: Task) => void
    createTemplate: (task: Task) => void
    isActive?: boolean
}

const TaskCard = ({
    task,
    selectTask,
    deleteTask,
    createTemplate,
    isActive = false,
}: TaskCardProps) => {
    const { t } = useTranslation()
    const isTemplate = task.is_template
    console.log(isTemplate,'---isTemplate')
    return (
        <div
            onClick={() => selectTask(task)}
            className={cn(
                "group relative flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer bg-card",
                getPriorityColorStyle(task.priority, 'border'),
                isActive
                    ? "border-primary shadow-sm"
                    : "border-border hover:border-primary/50",
                // style.bg
            )}
        >
            {/* Цветная точка слева */}
            <div className='absolute left-0 top-0 bottom-0 w-2 rounded-l-lg' style={getPriorityColorStyle(task.priority, 'background')} />

            <div className="flex items-center gap-4 flex-1 pl-3">
                <div className="flex flex-col">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {task.name}
                    </span>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
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
                            {isTemplate ? t('templates-page.delete-template') : t('tasks-page.delete-task')}
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => createTemplate(task)}>
                            <Copy className="h-4 w-4 mr-2" />
                            {isTemplates ? t('templates-page.create-template') : t('tasks-page.create-task')}
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default TaskCard