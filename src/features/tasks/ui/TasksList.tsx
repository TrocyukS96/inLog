import { useTranslation } from 'react-i18next'
import { Button } from '../../../shared/ui/button'
import { Card } from '../../../shared/ui/card'

import { useDeferredValue } from 'react'
import { TaskCard } from '../../../entities/task'
import type { Task } from '../../../entities/task/model/types'

interface Props {
  tasks: Task[]
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
}

const TasksList = ({ tasks, selectedTaskSlug,selectTask, deleteTask, createTemplate, changePagination }: Props) => {
  const { t } = useTranslation()

  const deferredTasks = useDeferredValue(tasks)

  return (
    <Card className="px-4 border-none bg-transparent">
        <div className="flex flex-col gap-2 overflow-y-auto">
          {deferredTasks.map((task) => (
            <TaskCard
              key={ `${task.is_template ? 'template' : 'task'}-${task.id}`}
              task={task}
              selectTask={selectTask}
              deleteTask={deleteTask}
              createTemplate={createTemplate}
              isActive={selectedTaskSlug === task.slug}
            />
          ))}
        </div>

      {
        deferredTasks.length >= 10 && (
          <div className="flex justify-center p-4">
            <Button variant="outline" onClick={() => changePagination({ limit: 10, offset: (tasks.length || 0) + 10 })}>
              {t('common.load-more')}
            </Button>
          </div>
        )
      }
    </Card>
  )
}

export default TasksList