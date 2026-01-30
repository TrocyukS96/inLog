import { useTranslation } from 'react-i18next'
import { Button } from '../../../shared/ui/button'
import { Card, CardContent } from '../../../shared/ui/card'

import type { Task } from '../../../entities/task/model/types'
import TaskCard from './TaskCard'

interface Props {
  tasks: Task[]
  getTask: (task: Task) => void
  deleteTask: (task: Task) => void
  createTemplate: (task: Task) => void
  changePagination: (params: { limit: number; offset: number }) => void
}

const TasksList = ({ tasks, getTask, deleteTask, createTemplate, changePagination }: Props) => {
  const { t } = useTranslation()

  return (
    <Card className="p-0 border-none bg-transparent">
      <CardContent className="p-0 border-none">
        <div className="flex flex-col gap-2 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              getTask={getTask}
              deleteTask={deleteTask}
              createTemplate={createTemplate}
            />
          ))}
        </div>
      </CardContent>

      {/* Пагинация */}
      {
        tasks.length >= 10 && (
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