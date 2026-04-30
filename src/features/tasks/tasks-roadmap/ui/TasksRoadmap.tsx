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
import type { TasksFilterParams } from '../../../../entities/task/model/types'
import '../../../../shared/styles/index.css'
import type { RoadmapColumnOption, RoadmapDetalizationMode } from '../model/types'
import RoadmapControls from './RoadmapControls'
import './TaskRoadmap.css'
import { convertToGanttTasks, getDefaultRoadmapColumns } from '../lib/roadmapHelpers'
import { scalePresets, taskTypes } from '../lib/data'

const CONTAINER_HEIGHT = 'calc(100vh - 200px)'

function TasksRoadmap() {
    const { t, i18n } = useTranslation()
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

    const columns = useMemo(() => getDefaultRoadmapColumns(t), [t])

    const [columnSettings, setColumnSettings] = useState<{ showTable: boolean; visibleColumns: RoadmapColumnOption[] }>({
        showTable: true,
        visibleColumns: columns.map(col => ({ id: col.id, label: col.header })),
    })

    const { data: tasksData, isLoading, isFetching } = useGetTasksQuery({
        projectId: Number(projectId),
        params: { is_template: false, ...filterParams },
    }, { skip: !projectId })

    const ganttTasks = useMemo(() => {
        const tasks = convertToGanttTasks(tasksData?.results || [], i18n.language)
        return tasks
    }, [tasksData?.results, i18n.language])



    const ganttRange = useMemo(() => {
        if (!ganttTasks.length) return {}

        const dates = ganttTasks.flatMap(t => [t.start, t.end])
        return {
            start: dateFrom ? new Date(dateFrom) : new Date(Math.min(...dates.map(d => d.getTime()))),
            end: dateTo ? new Date(dateTo) : new Date(Math.max(...dates.map(d => d.getTime()))),
        }
    }, [ganttTasks, dateFrom, dateTo])

    const filteredColumns = useMemo(() => {
        if (!columnSettings.showTable) return []

        return columns.filter(col =>
            columnSettings.visibleColumns.some(c => c.id === col.id)
        )
    }, [columnSettings, columns])

    const GanttWrapper = theme === 'dark' ? WillowDark : Willow

    return (
        <div className="flex flex-col gap-4 pt-1">
            <RoadmapControls
                disabled={isLoading || isFetching}
                initialValues={{
                    limit: 100,
                    offset: 0
                }}
                viewMode={viewMode}
                columnSettings={columnSettings}
                onChangeColumnSettings={setColumnSettings}
                setViewMode={setViewMode}
                onFilterChange={setFilterParams}
            />

            <div className="rounded-lg overflow-hidden overflow-y-auto"
                style={{ height: CONTAINER_HEIGHT }}
            >

                {
                    ( ganttTasks.length > 0 && !isLoading && !isFetching) ? (
                        <Locale words={'ru'}>
                            <GanttWrapper>
                                <Gantt
                                    tasks={ganttTasks}
                                    scales={scalePresets[viewMode as keyof typeof scalePresets]}
                                    columns={filteredColumns}
                                    start={ganttRange.start}
                                    end={ganttRange.end}
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