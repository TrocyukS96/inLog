'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../../../entities/task/model/types'
import { TaskCard } from '../../../../entities/task'
import { cn } from '../../../../shared/lib/utils'
import { memo } from 'react'

interface Props {
    task: Task
    onClick?: (task: Task | undefined) => void
    onDelete?: (task: Task | undefined) => void
    isActive?: boolean
    className?: string
}

const SortableTaskCard = ({ task, onClick, onDelete, isActive, className }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: task.id,
        data: {
            type: 'task',
            task: task,
        },
        disabled: false, // Явно указываем, что не отключено
        animateLayoutChanges: () => true,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleClick = (e: React.MouseEvent) => {
        // Предотвращаем срабатывание drag при клике
        if (!isDragging) {
            onClick?.(task)
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50",
                className
            )}
            onClick={handleClick}
        >
            <TaskCard
                task={task}
                selectTask={() => {}}
                deleteTask={() => onDelete?.(task)}
                createTemplate={() => {}}
                isActive={isActive}
            />
        </div>
    )
}

export default memo(SortableTaskCard);