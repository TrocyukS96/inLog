'use client'

import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core'
import {
    restrictToParentElement,
    restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useSearchParams } from 'react-router-dom'
import { TaskCard } from '../../../../entities/task'
import { useGetStatusesQuery, useGetTasksQuery } from '../../../../entities/task/model/taskSlice'
import type { Task } from '../../../../entities/task/model/types'
import { ScrollArea } from '../../../../shared/ui/scroll-area'
import KanbanColumn from './KanbanColumn'
import { SortableTaskCard } from './SortableTaskCard'
import { cn } from '../../../../shared/lib/utils'
import type { LanguageType } from '../../../../shared/types/enums'

const KANBAN_HEIGHT = 'h-[calc(100vh-64px-32px-32px-16px)]';

interface Props {
    isLoading?: boolean
    onTaskClick?: (task: Task) => void
    onTaskDelete?: (task: Task) => void
    onTaskStatusChange?: (taskId: number, newStatusId: number) => void
    onCreateTask?: (statusId: number) => void
    selectedTaskSlug?: string
}

const TasksKanban = ({
    isLoading,
    onTaskClick,
    onTaskDelete,
    onTaskStatusChange,
    onCreateTask,
    selectedTaskSlug,
}: Props) => {
    const { t, i18n } = useTranslation()
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [columns, setColumns] = useState<Record<number, Task[]>>({})
    const [searchParams] = useSearchParams()
    const projectId = searchParams.get('project')

    const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery(
        { projectId: Number(projectId), params: { limit: 10000 } },
        { skip: !projectId }
    )

    const tasks = useMemo(() => tasksData?.results || [], [tasksData?.results])

    const { data: statuses, isLoading: statusesLoading } = useGetStatusesQuery(
        { projectId: Number(projectId) },
        { skip: !projectId }
    )

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        if (!statuses || !tasks) return

        const grouped = statuses.reduce((acc, status) => {
            acc[status.id] = tasks.filter(task => task.status.id === status.id)
            return acc
        }, {} as Record<number, Task[]>)

        setColumns(grouped)
    }, [tasks, statuses])

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const task = tasks.find(t => t.id === active.id)
        setActiveTask(task || null)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveTask(null)

        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const activeTask = tasks.find(t => t.id === activeId)
        const overTask = tasks.find(t => t.id === overId)

        if (!activeTask) return

        if (over.data.current?.type === 'column') {
            const newStatusId = Number(overId)
            if (activeTask.status.id !== newStatusId) {
                onTaskStatusChange?.(activeTask.id, newStatusId)
            }
            return
        }

        if (activeTask.status.id === overTask?.status.id) {
            const statusId = activeTask.status.id
            const oldIndex = columns[statusId].findIndex(t => t.id === activeId)
            const newIndex = columns[statusId].findIndex(t => t.id === overId)

            const newColumns = { ...columns }
            newColumns[statusId] = arrayMove(newColumns[statusId], oldIndex, newIndex)
            setColumns(newColumns)
        }
    }

    if (isLoading || statusesLoading || tasksLoading) {
        return (
            <div className={cn("flex items-center justify-center", KANBAN_HEIGHT)}>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!statuses?.length) {
        return (
            <div className={cn("flex items-center justify-center", KANBAN_HEIGHT)}>
                <div className="text-center">
                    <p className="text-lg mb-2">{t('kanban.no-statuses')}</p>
                    <p className="text-sm">{t('kanban.create-status-first')}</p>
                </div>
            </div>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
            <div
                className={cn(
                    "w-full min-w-0 overflow-x-auto",
                    KANBAN_HEIGHT
                )}
            >
                <div
                    className="flex gap-4 pb-4 w-max h-full"
                >
                    {statuses.map((status) => (
                        <div key={status.id}>
                            <KanbanColumn
                                id={status.id}
                                title={status[`name_${(i18n.language || 'ru') as LanguageType}`] || ''}
                                color={''}
                                count={columns[status.id]?.length || 0}
                                onAddClick={() => onCreateTask?.(status.id)}
                            >
                                <SortableContext
                                    items={columns[status.id]?.map(t => t.id) || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <ScrollArea className="h-[calc(100vh-64px-32px-32px-16px-120px)]">
                                        <div className="space-y-2">
                                            {columns[status.id]?.map((task) => (
                                                <SortableTaskCard
                                                    key={task.id}
                                                    task={task}
                                                    onClick={() => onTaskClick?.(task)}
                                                    onDelete={() => onTaskDelete?.(task)}
                                                    isActive={selectedTaskSlug === task.slug}
                                                />
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </SortableContext>
                            </KanbanColumn>
                        </div>
                    ))}
                </div>
            </div>

            <DragOverlay>
                {activeTask && (
                    <div className="opacity-80 rotate-2 scale-105">
                        <TaskCard
                            task={activeTask}
                            selectTask={() => { }}
                            deleteTask={() => { }}
                            createTemplate={() => { }}
                            isActive={false}
                        />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    )
}

export default TasksKanban