import { Card } from '../../../shared/ui/card'

import { useCallback, useEffect, useRef } from 'react'
import { TaskCard, TaskCardSkeleton } from '../../../entities/task'
import type { Task } from '../../../entities/task/model/types'
import { cn } from '../../../shared/lib/utils'
import { ScrollArea } from '../../../shared/ui/scroll-area'

interface Props {
  tasks: Task[]
  isLoading: boolean
  selectedTaskSlug?: string
  selectTask: (task: Task) => void
  deleteTask: (task: Task) => void
  createTemplate: (task: Task) => void
  changePagination: (params: { limit: number; offset: number }) => void
  pagination: {
    limit: number
    offset: number
    total: number
  }
  hasMore?: boolean
}

const TASKS_LIST_HEIGHT = 'h-[calc(100vh-64px-16px-36px-16px-36px-32px-116px)]'

const TasksList = ({
  tasks,
  isLoading,
  selectedTaskSlug,
  selectTask,
  deleteTask,
  createTemplate,
  changePagination,
  pagination,
  hasMore = true
}: Props) => {

  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastTaskRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(() => {
    if (hasMore && tasks.length < pagination.total) {
      console.log('loadMore')
      // changePagination({ 
      //   limit: pagination.limit, 
      //   offset: tasks.length 
      // })
    }
  }, [hasMore, tasks.length, pagination.total, pagination.limit, changePagination])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore && tasks.length < pagination.total) {
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
      }
    )

    if (lastTaskRef.current) {
      observerRef.current.observe(lastTaskRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, tasks.length, pagination.total, loadMore])

  return (
    <Card className="px-4 border-none bg-transparent">

      <ScrollArea className={cn("flex flex-col gap-2", TASKS_LIST_HEIGHT)}>
        {isLoading && (
          <div className="w-full h-full flex items-center flex-col gap-2  text-muted-foreground">
            {Array.from({ length: 10 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          </div>
        )}
        {!isLoading && tasks.map((task, index) => {
          const isLastElement = index === tasks.length - 1

          return (
            <div
              key={`${task.is_template ? 'template' : 'task'}-${task.id}`}
              ref={isLastElement ? lastTaskRef : null}
            >
              <TaskCard
                task={task}
                selectTask={selectTask}
                deleteTask={deleteTask}
                createTemplate={createTemplate}
                className={!isLastElement ? 'mb-2' : ''}
                isActive={selectedTaskSlug === task.slug}
              />
            </div>
          )
        })}

        {!isLoading && hasMore && tasks.length < pagination.total && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}

export default TasksList