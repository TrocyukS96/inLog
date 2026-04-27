'use client'

import { Locale } from '@svar-ui/react-core'
import { Gantt, Willow, WillowDark } from '@svar-ui/react-gantt'
import "@svar-ui/react-gantt/all.css"
import { AlertCircle, Clock } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useGetTasksQuery } from '../../../../entities/task/model/taskSlice'
import type { Task, TasksFilterParams } from '../../../../entities/task/model/types'
import '../../../../shared/styles/index.css'
import type { RoadmapDetalizationMode } from '../model/types'
import RoadmapControls from './RoadmapControls'
import './TaskRoadmap.css'

const CONTAINER_HEIGHT = 'calc(100vh - 200px)'

interface GanttTask {
    id: number
    text: string
    start: Date
    end: Date
    parent?: number
    type: string
    open?: boolean
}

const scalePresets = {
    year: [
        { unit: "year", step: 1, format: "%Y" },
    ],
    month: [
        { unit: "month", step: 1, format: "%M %Y" },
    ],
    week: [
        { unit: "month", step: 1, format: "%M %Y" },
        { unit: "week", step: 1, format: "Week %W" },
    ],
    day: [
        { unit: "month", step: 1, format: "%M %Y" },
        { unit: "week", step: 1, format: "Week %W" },
        { unit: "day", step: 1, format: "%d" },
    ],
};

const convertToGanttTasks = (tasks: Task[]): GanttTask[] => {
    const validTasks = tasks.filter(task => {
        if (!task.due_date_start || !task.due_date_end) return false
        const start = new Date(task.due_date_start)
        const end = new Date(task.due_date_end)
        return start <= end
    })

    const mappedTasks = validTasks.map(task => ({
        id: task.id,
        text: task.name,
        start: new Date(task.due_date_start!),
        end: new Date(task.due_date_end!),
        parent: task.parent || undefined,
        type: task.parent ? (task.priority || 'task') : 'summary',
        open: task.parent ? undefined : true,
        // progress: 0,
    }))

    return mappedTasks
}


function TasksRoadmap() {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const [searchParams] = useSearchParams()

    const projectId = searchParams.get('project')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')

    const [viewMode, setViewMode] = useState<RoadmapDetalizationMode>('day')
    const [filterParams, setFilterParams] = useState<Partial<TasksFilterParams>>({
        limit: 100,
        offset: 0
    })

    const { data: tasksData, isLoading, isFetching } = useGetTasksQuery({
        projectId: Number(projectId),
        params: { is_template: false, ...filterParams },
    }, { skip: !projectId })

    const ganttTasks = useMemo(() => {
        const tasks = convertToGanttTasks(tasksData?.results || [])
        console.log('Parent tasks:', tasks.filter(t => t.type === 'summary').map(t => ({ id: t.id, text: t.text, hasChildren: tasks.some(child => child.parent === t.id) })))
        console.log('Child tasks:', tasks.filter(t => t.parent).map(t => ({ id: t.id, text: t.text, parent: t.parent })))
        return tasks
    }, [tasksData?.results])

    const taskTypes = useMemo(() => [
        { id: "summary", label: "Сводка" },
        { id: "task", label: "Задача" },
        { id: "critical", label: "Критическая" },
        { id: "important", label: "Важная" },
        { id: "low", label: "Низкий приоритет" },
        { id: "medium", label: "Средний приоритет" },
        { id: "default", label: "Обычная" },
    ], []);

    const columns = useMemo(() => [
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
            cell: (task: any) => (
                <div className="text-sm">
                    {task?.row?.end
                        ? new Date(task.row.end).toLocaleDateString()
                        : '-'}
                </div>
            ),
        },
    ], [t])

    const handleFilterChange = (filters: Partial<TasksFilterParams>) => {
        setFilterParams({
            ...(filterParams ?? {}),
            ...filters
        } as Partial<TasksFilterParams>)
    }

    const ganttRange = useMemo(() => {
        if (!ganttTasks.length) return {}

        const dates = ganttTasks.flatMap(t => [t.start, t.end])
        return {
            start: dateFrom ? new Date(dateFrom) : new Date(Math.min(...dates.map(d => d.getTime()))),
            end: dateTo ? new Date(dateTo) : new Date(Math.max(...dates.map(d => d.getTime()))),
        }
    }, [ganttTasks, dateFrom, dateTo])

    const GanttWrapper = theme === 'dark' ? WillowDark : Willow

    return (
        <div className="flex flex-col gap-4 pt-1">
            <RoadmapControls
                disabled={isLoading || isFetching}
                initialValues={filterParams}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onFilterChange={handleFilterChange}
            />

            <div className="rounded-lg overflow-hidden overflow-y-auto"
                style={{ height: CONTAINER_HEIGHT }}
            >

                {
                    (tasksData?.results?.length && tasksData?.results?.length > 0 && !isLoading && !isFetching) ? (
                        <Locale words={'ru'}>
                            <GanttWrapper>
                                <Gantt
                                    tasks={ganttTasks}
                                    scales={scalePresets[viewMode as keyof typeof scalePresets]}
                                    columns={columns}
                                    start={ganttRange.start}
                                    end={ganttRange.end}
                                    // cellWidth={CELL_WIDTH}
                                    // cellHeight={CELL_HEIGHT}
                                    taskTypes={taskTypes}
                                />
                            </GanttWrapper>
                        </Locale>
                    ) : (isLoading || isFetching) ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <AlertCircle className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{t('tasks-page.roadmap.no-tasks-with-filters')}</p>
                        </div>
                    )
                }

            </div>
        </div>
    )
}

export default TasksRoadmap