import type { TFunction } from "i18next"
import type { Task, TaskPriority } from "../../../../entities/task/model/types"
import { getPriorityColorStyle } from "../../../../shared/lib/utils"
import type { GanttTask } from "../model/types"

export const convertToGanttTasks = (tasks: Task[], language: string): GanttTask[] => {
    const validTasks = tasks.filter(task => {
        if (!task.due_date_start || !task.due_date_end) return false
        const start = new Date(task.due_date_start)
        const end = new Date(task.due_date_end)
        return start <= end
    })

    const status = language === 'ru' ? 'name_ru' : 'name_en'

    const mappedTasks = validTasks.map((task,i,array) => {
        const targetParent = array.find(t => t.id === task.parent)
        return {
            id: task.id,
            text: task.name,
            start: new Date(task.due_date_start!),
            end: new Date(task.due_date_end!),
            parent: targetParent ? targetParent.id : undefined,
            type: task.priority,
            open: task.parent ? undefined : true,
            status: task.status[status] || '',
            priority: task.priority || '',
            slug: task.slug,
        }
    })

    return mappedTasks
}

export const getDefaultRoadmapColumns = (t: TFunction<"translation", undefined>) => {
    return [
        {
            header: t('tasks-page.roadmap.columns.task'),
            id: 'text',
            cell: (task: any) => (
                <div className="text-sm max-w-[200px] truncate ">
                    {task?.row?.text}
                </div>
            ),
        },
        {
            header: t('tasks-page.roadmap.columns.start'),
            id: 'start',
            cell: (task: any) => (
                <div className="text-sm">
                    {task?.row?.start
                        ? new Date(task.row.start).toLocaleDateString()
                        : '-'}
                </div>
            ),
        },
        {
            header: t('tasks-page.roadmap.columns.end'),
            id: 'end',
            cell: (task: any) => {
                return <div className="text-sm">
                    {task?.row?.end
                        ? new Date(task.row.end).toLocaleDateString()
                        : '-'}
                </div>
            },
        },
        {
            header: t('fields.status'),
            id: 'status',
            cell: (task: any) => {
                return <div className="text-sm">
                    {task?.row?.status}
                </div>
            },
        },
        {
            header: t('fields.priority'),
            id: 'priority',
            cell: (task: any) => {
                return <div className={`text-sm p-1 rounded-md`}
                    style={getPriorityColorStyle(task?.row?.priority as TaskPriority, 'background')}
                >
                    {task?.row?.priority ? `${t(`fields.priority-types.${task?.row?.priority}`)}` : '-'}
                </div>
            },
        },
    ]
}