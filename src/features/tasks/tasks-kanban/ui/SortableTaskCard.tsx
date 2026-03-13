'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../../../entities/task/model/types'
import { TaskCard } from '../../../../entities/task'

interface Props {
    task: Task
    onClick?: () => void
    onDelete?: () => void
    isActive?: boolean
}

export const SortableTaskCard = ({ task, onClick, onDelete, isActive }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            <TaskCard
                task={task}
                selectTask={() => onClick?.()}
                deleteTask={() => onDelete?.()}
                createTemplate={() => {}}
                isActive={isActive}
            />
        </div>
    )
}