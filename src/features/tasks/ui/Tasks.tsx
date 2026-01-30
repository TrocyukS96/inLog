import { Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '../../../shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog'

import { useCreateTaskMutation, useDeleteTaskMutation, useGetTasksQuery } from '../../../entities/task/model/taskSlice'

import type { Task, TasksFilterParams } from '../../../entities/task/model/types'
import TasksFilter from '../../../features/tasks/ui/TasksFilter'
import { routes } from '../../../shared/lib/routes'
import CreateTaskForm from './CreateTaskForm'
import TasksList from './TasksList'

export default function Tasks() {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const projectId = searchParams.get('project')

    const [createModalOpen, setCreateModalOpen] = useState(false)

    const [filterParams, setFilterParams] = useState<Partial<TasksFilterParams>>({ limit: 10, offset: 0 })

    // Запрос задач
    const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery({
        projectId: Number(projectId),
        params: filterParams ?? {},
    }, { skip: !projectId })

    console.log(tasksData, 'tasksData')

    const [deleteTask] = useDeleteTaskMutation()

    const [createTask] = useCreateTaskMutation()

    // Создание задачи
    const handleAddTask = async (name: string, priority: Task['priority']) => {
        if (!Number(projectId)) {
            toast.error(t('errors.select-project-first'))
            return
        }

        try {
            await createTask({
                projectId: Number(projectId),
                data: {
                    name: name.trim(),
                    priority,
                },
            }).unwrap()
            toast.success(t('notice-list.task-created'))
            setCreateModalOpen(false)
        } catch {
            toast.error(t('errors.error-creating-task'))
        }
    }

    const navigateToTask = (task: Task) => {
        navigate(routes.scheduler.task(task.slug))
    }

    const removeTask = async (task: Task) => {
        try {
            await deleteTask({ projectId: Number(projectId), taskSlug: task.slug }).unwrap()
            toast.success(t('notice-list.task-deleted'))
            const remaining = tasksData?.results.filter(t => t.id !== task.id)
            if (remaining?.length) {
                navigateToTask(remaining[0])
            } else {
                navigate(routes.scheduler.tasks())
            }
        } catch {
            toast.error(t('errors.error-deleting-task'))
        }
    }

    const createTemplate = (_task: Task) => {
        toast.info(t('notice-list.template-created-from-task'))
    }

    const handleFilterChange = (newParams: Partial<Omit<TasksFilterParams, 'projectId'>>) => {
        setFilterParams({ ...(filterParams ?? {}), ...newParams } as TasksFilterParams)
    }

    if (tasksLoading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('tasks-page.title')}
                </h1>

                <div className="flex items-center gap-4">
                    {/* Фильтр */}
                    <TasksFilter />
                    {/* Создать задачу */}
                    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('tasks-page.create-task')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{t('tasks-page.create-task')}</DialogTitle>
                            </DialogHeader>
                            <CreateTaskForm onCreate={handleAddTask} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {
                tasksData?.results && tasksData?.results.length > 0 && (
                    <TasksList
                        tasks={tasksData?.results || []}
                        getTask={navigateToTask}
                        deleteTask={removeTask}
                        createTemplate={createTemplate}
                        changePagination={(params) => handleFilterChange(params)}
                    />
                )}

                {(tasksData?.results && tasksData?.results.length === 0 || !tasksData?.results) && (
                    <div className="text-center py-12 text-muted-foreground">
                        {t('tasks-page.tasks-absent-message')}
                    </div>
                )}

        </div>
    )
}