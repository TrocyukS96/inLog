'use client'

import { useDroppable } from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { Button } from '../../../../shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/ui/card'
import { cn } from '../../../../shared/lib/utils'

interface Props {
    id: number
    title: string
    color?: string
    count: number
    onAddClick?: () => void
    children: React.ReactNode
}

const KanbanColumn = ({ id, title, color, count, onAddClick, children }: Props) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
        data: {
            type: 'column',
            statusId: id,
        },
    })

    return (
        <Card
            ref={setNodeRef}
            className={cn(
                "flex flex-col w-[320px] border-border flex-shrink-0 h-full transition-all duration-200",
                isOver && "ring-2 ring-primary ring-opacity-50 bg-accent/50"
            )}
        >
            <CardHeader className="p-2 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {color && (
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                        )}
                        <CardTitle className="text-sm font-medium">
                            {title}
                        </CardTitle>
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {count}
                        </span>
                    </div>
                    {onAddClick && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={onAddClick}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-2 pt-0 flex-1 overflow-hidden">
                {children}
            </CardContent>
        </Card>
    )
}

export default KanbanColumn