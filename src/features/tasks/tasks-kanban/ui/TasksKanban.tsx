'use client'

import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MeasuringStrategy,
    PointerSensor,
    closestCenter,
    pointerWithin,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent
} from '@dnd-kit/core'
import {
    restrictToParentElement
} from '@dnd-kit/modifiers'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useGetStatusesQuery, useGetTaskByParamsMutation, useUpdateTaskMutation } from '../../../../entities/task/model/taskSlice'
import type { Task } from '../../../../entities/task/model/types'
import { errorsHandler } from '../../../../shared/lib/errors-handler'
import { cn } from '../../../../shared/lib/utils'
import type { LanguageType } from '../../../../shared/types/enums'
import { ScrollArea } from '../../../../shared/ui/scroll-area'
import KanbanColumn from './KanbanColumn'
import SortableTaskCard from './SortableTaskCard'

const KANBAN_HEIGHT = 'h-[calc(100vh-64px-32px-32px-16px)]';

interface Props {
    isLoading?: boolean
    onTaskClick?: (task: Task | undefined) => void
    onTaskDelete?: (task: Task | undefined) => void
    onCreateTask?: (statusId: number) => void
    selectedTaskSlug?: string
}

const TasksKanban = (props: Props) => {
    const { isLoading, onTaskClick, onTaskDelete, selectedTaskSlug } = props

    const { t, i18n } = useTranslation()
    const [columns, setColumns] = useState<Record<number, Task[]>>({})
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const [dragMeta, setDragMeta] = useState<{
        taskId: number
        fromStatusId: number
    } | null>(null)

    const [searchParams] = useSearchParams()
    const projectId = searchParams.get('project')

    const [isTasksLoading, setIsTasksLoading] = useState(false)

    const [getTaskByParams] = useGetTaskByParamsMutation()
    const [updateTask] = useUpdateTaskMutation()

    const { data: statuses, isLoading: statusesLoading } = useGetStatusesQuery(
        { projectId: Number(projectId) },
        { skip: !projectId }
    )

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const fetchTasksByStatuses = useCallback(async () => {
        if (!statuses || !projectId) return

        setIsTasksLoading(true)
        try {
            const results = await Promise.all(
                statuses.map(status =>
                    getTaskByParams({
                        projectId: Number(projectId),
                        params: {
                            status: status.id.toString(),
                            limit: 1000,
                            ordering: 'status_position',
                            is_template: false
                        }
                    }).unwrap()
                )
            )

            const newColumns: Record<number, Task[]> = {}
            statuses.forEach((status, i) => {
                newColumns[status.id] = results[i]?.results || []
            })

            setColumns(newColumns)
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            setIsTasksLoading(false)
        }
    }, [statuses, projectId, getTaskByParams, t])

    useEffect(() => {
        fetchTasksByStatuses()
    }, [fetchTasksByStatuses])

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event

        for (const [statusId, tasks] of Object.entries(columns)) {
            const task = tasks.find(t => t.id === active.id)
            if (task) {
                setActiveTask(task)
                setDragMeta({
                    taskId: task.id,
                    fromStatusId: Number(statusId),
                })
                break
            }
        }
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overData = over.data.current

        if (!overData) return

        setColumns(prev => {
            let sourceStatusId: number | null = null

            for (const [statusId, tasks] of Object.entries(prev)) {
                if (tasks.find(t => t.id === activeId)) {
                    sourceStatusId = Number(statusId)
                    break
                }
            }

            if (!sourceStatusId) return prev

            let targetStatusId: number | null = null

            if (overData.type === 'column') {
                targetStatusId = overData.statusId
            } else if (overData.type === 'task') {
                targetStatusId = overData.task.status.id
            }

            if (!targetStatusId || sourceStatusId === targetStatusId) return prev

            const source = [...prev[sourceStatusId]]
            const target = [...prev[targetStatusId]]

            const index = source.findIndex(t => t.id === activeId)
            if (index === -1) return prev

            const [moved] = source.splice(index, 1)

            const updated = {
                ...moved,
                status: { ...moved.status, id: targetStatusId }
            }

            const overIndex = target.findIndex(t => t.id === over.id)

            if (overIndex === -1) {
                target.push(updated)
            } else {
                target.splice(overIndex, 0, updated)
            }

            return {
                ...prev,
                [sourceStatusId]: source,
                [targetStatusId]: target
            }
        })
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || !dragMeta) return

        const overData = over.data.current

        let targetStatusId: number

        if (overData?.type === 'column') {
            targetStatusId = overData.statusId
        } else {
            targetStatusId = overData?.task?.status?.id
        }

        const { fromStatusId } = dragMeta

        setColumns(prev => {
            const source = [...prev[fromStatusId]]
            const target = [...prev[targetStatusId]]

            const oldIndex = source.findIndex(t => t.id === active.id)
            if (oldIndex === -1) return prev

            const [moved] = source.splice(oldIndex, 1)

            let newIndex = 0

            if (overData?.type === 'task') {
                newIndex = target.findIndex(t => t.id === over.id)
            } else {
                newIndex = target.length
            }

            if (newIndex < 0) newIndex = target.length

            const updated = {
                ...moved,
                status: { ...moved.status, id: targetStatusId }
            }

            target.splice(newIndex, 0, updated)

            // 🔥 ВАЖНО: позиция = индекс + 1
            const targetPosition = newIndex + 1

            // 🔥 API
            updateTask({
                projectId: Number(projectId),
                taskSlug: updated.slug,
                data: {
                    status: targetStatusId,
                    status_position: targetPosition
                },
            }).catch((error) => {
                errorsHandler(error, t)
                fetchTasksByStatuses()
            })

            return {
                ...prev,
                [fromStatusId]: source,
                [targetStatusId]: target
            }
        })

        setActiveTask(null)
        setDragMeta(null)
    }

    if (isLoading || statusesLoading || isTasksLoading) {
        return (
            <div className={cn("flex items-center justify-center", KANBAN_HEIGHT)}>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement]}
        >
            <div className="flex gap-4 overflow-x-auto pb-2">
                {statuses?.map(status => (
                    <KanbanColumn
                        key={status.id}
                        id={status.id}
                        title={status[`name_${i18n.language as LanguageType}`] || ''}
                        count={columns[status.id]?.length || 0}
                    >
                        <SortableContext
                            items={columns[status.id]?.map(t => t.id) || []}
                            strategy={verticalListSortingStrategy}
                        >
                            <ScrollArea className="h-[calc(100vh-64px-32px-32px-16px-80px)] flex flex-col gap-2">
                                {columns[status.id]?.map((task, taskIndex) => (
                                    <SortableTaskCard
                                        key={task.id}
                                        task={task}
                                        onClick={onTaskClick}
                                        onDelete={onTaskDelete}
                                        isActive={selectedTaskSlug === task.slug}
                                        className={cn(taskIndex !== 0 && 'mt-2')}
                                    />
                                ))}
                            </ScrollArea>
                        </SortableContext>
                    </KanbanColumn>
                ))}
            </div>

            <DragOverlay>
                {activeTask && (
                    <div className="opacity-80 rotate-2 scale-105">
                        <SortableTaskCard task={activeTask} />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    )
}

export default TasksKanban;