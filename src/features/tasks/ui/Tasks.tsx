import { Loader2, Plus, Search, SortAsc, SortDesc, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '../../../shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../shared/ui/dialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../shared/ui/resizable'

import { useCreateTaskMutation, useDeleteTaskMutation, useGetStatusesQuery, useGetTaskQuery, useGetTasksQuery, useGetTaskTagsQuery } from '../../../entities/task/model/taskSlice'

import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { useGetProjectMembersQuery } from '../../../entities/project/model/projectSlice'
import type { Task, TasksFilterParams } from '../../../entities/task/model/types'
import { TaskDetails } from '../../../features/task-details'
import { DATE_REQUEST_FORMAT, DEBOUNCE_DELAY } from '../../../shared/config/constants'
import useDebounce from '../../../shared/lib/hooks/use-deboucne'
import { Input } from '../../../shared/ui/input'
import { RangePicker } from '../../../shared/ui/range-picker'
import CreateTaskForm from './CreateTaskForm'
import TasksList from './TasksList'

export default function Tasks({ type = 'tasks-page' }: { type?: 'tasks-page' | 'templates-page' }) {
    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()

    const isTemplates = type === 'templates-page'

    const projectId = searchParams.get('project')
    const selectedTaskSlug = searchParams.get('task')

    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [filterParams, setFilterParams] = useState<Partial<TasksFilterParams>>({
        limit: 100,
        offset: 0
    })
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearchValue = useDebounce<string>(searchValue, DEBOUNCE_DELAY)

    const { data: statuses } = useGetStatusesQuery({ projectId: Number(projectId) }, { skip: !projectId })
    const { data: members } = useGetProjectMembersQuery(Number(projectId), { skip: !projectId })
    const { data: tagsResponse } = useGetTaskTagsQuery({ projectId: Number(projectId), limit: 9999, is_orphan: false }, { skip: !projectId })

    const { data: tasksData, isLoading: tasksLoading, isFetching: tasksFetching } = useGetTasksQuery({
        projectId: Number(projectId),
        params: { ...(filterParams ?? {}), ...{ is_template: isTemplates ? true : false } },

    }, { skip: !projectId })

    const { data: taskData, isFetching: taskFetching, isLoading: taskLoading } = useGetTaskQuery({
        projectId: Number(projectId),
        taskSlug: selectedTaskSlug || '',
    }, { skip: !projectId || !selectedTaskSlug })

    const [deleteTask] = useDeleteTaskMutation()
    const [createTask] = useCreateTaskMutation()

    const handleAddTask = async (name: string, priority: Task['priority']) => {
        if (!Number(projectId)) {
            toast.error(t('errors.select-project-first'))
            return
        }

        try {
            const newTask = await createTask({
                projectId: Number(projectId),
                data: {
                    name: name.trim(),
                    priority,
                    is_template: isTemplates,
                },
            }).unwrap()

            toast.success(isTemplates ? t('notice-list.template-created') : t('notice-list.task-created'))
            setCreateModalOpen(false)

            handleSelectTask(newTask)
        } catch {
            toast.error(isTemplates ? t('errors.error-creating-template') : t('errors.error-creating-task'))
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    const handleSelectTask = (task: Task) => {
        searchParams.set('task', task.slug)
        setSearchParams(searchParams)
    }

    const handleCloseTaskDetails = () => {
        searchParams.delete('task')
        setSearchParams(searchParams)
    }

    const handleDeleteTask = async (task: Task) => {
        try {
            await deleteTask({
                projectId: Number(projectId),
                taskSlug: task.slug
            }).unwrap()

            toast.success(isTemplates ? t('notice-list.template-deleted') : t('notice-list.task-deleted'))

            if (selectedTaskSlug === task.slug) {
                handleCloseTaskDetails()
            }
        } catch {
            toast.error(isTemplates ? t('errors.error-deleting-template') : t('errors.error-deleting-task'))
        }
    }

    const createTemplate = (_task: Task) => {
        toast.info(t('notice-list.template-created-from-task'))
    }

    const handleFilterChange = (value: DateRange | string | undefined, filterType: 'date' | 'search') => {
        if (filterType === 'date') {
            const created_at__range = value && typeof value === 'object'
                ? format(value?.from || new Date(), DATE_REQUEST_FORMAT) + ',' + format(value?.to || new Date(), DATE_REQUEST_FORMAT)
                : undefined
            setFilterParams({
                ...(filterParams ?? {}),
                created_at__range: created_at__range
            } as TasksFilterParams)
        } else {
            setSearchValue(value as string)
        }
    }

    const handlePaginationChange = (value: { limit: number; offset: number }) => {
        setFilterParams({ ...(filterParams ?? {}), ...value } as TasksFilterParams)
    }

    useEffect(() => {
        setFilterParams({
            ...(filterParams ?? {}),
            name__icontains: debouncedSearchValue || undefined
        } as TasksFilterParams)
    }, [debouncedSearchValue])

    useEffect(() => {
        let toastId: string | number | undefined
        if (taskFetching) {
            toastId = toast.loading(t('notice-list.loading-task'))
        }else{
            toast.dismiss(toastId)
        }

        return () => {
            toast.dismiss(toastId)
        }
    }, [taskFetching])

    const renderTaskDetails = () => {
        if (!selectedTaskSlug || !taskData) {
            return <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                    <p className="text-lg mb-2">{isTemplates ? t(`templates-page.no-templates-selected`) : t(`tasks-page.no-task-selected`)}</p>
                    <p className="text-sm">{isTemplates ? t(`templates-page.select-template-to-view`) : t(`tasks-page.select-task-to-view`)}</p>
                </div>
            </div>
        }
        if (taskLoading) {
            return <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }
        return <TaskDetails
            task={taskData}
            tags={tagsResponse?.results ?? []}
            statuses={statuses ?? []}
            members={members ?? []}
            taskSlug={selectedTaskSlug || ''}
        />
    }

    return (
        <ResizablePanelGroup
            className="h-fit rounded-lg border border-border "
            orientation="horizontal"
        >
            <ResizablePanel
                defaultSize={40}
            >
                <div className="flex flex-col h-full ">
                    <div className="p-4 ">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t(`${type}.title`)}
                            </h1>
                            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" disabled={tasksLoading || taskFetching || !projectId}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        {isTemplates ? t(`templates-page.create-template`) : t(`tasks-page.create-task`)}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{isTemplates ? t(`templates-page.create-template`) : t(`tasks-page.create-task`)}</DialogTitle>
                                    </DialogHeader>
                                    <CreateTaskForm onCreate={handleAddTask} isTemplates={isTemplates} />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    value={searchValue}
                                    onChange={handleSearch}
                                    className="w-full pl-9 pr-8"
                                    placeholder={t('fields.search')}
                                    disabled={tasksLoading || taskFetching || tasksData?.results?.length === 0 || !projectId}
                                />
                                {searchValue && (
                                    <X
                                        className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                                        onClick={() => setSearchValue('')}
                                    />
                                )}
                            </div>

                            <div className="flex gap-2">
                                <RangePicker
                                    value={filterParams.created_at__range
                                        ? {
                                            from: new Date(filterParams.created_at__range.split(',')[0]),
                                            to: new Date(filterParams.created_at__range.split(',')[1])
                                        }
                                        : undefined}
                                    placeholder={t('fields.date-range')}
                                    onChange={(range) => handleFilterChange(range, 'date')}
                                    className="flex-1"
                                    disabled={tasksLoading || taskFetching || tasksData?.results?.length === 0 || !projectId}
                                />

                                <Button
                                    variant="outline"
                                    size="icon"
                                    disabled={tasksLoading || taskFetching || tasksData?.results?.length === 0 || !projectId}
                                    onClick={() => setFilterParams({
                                        ...(filterParams ?? {}),
                                        ordering: filterParams.ordering === '-created_at' ? 'created_at' : '-created_at'
                                    } as TasksFilterParams)}
                                >
                                    {filterParams.ordering === '-created_at' ? (
                                        <SortDesc className="h-4 w-4" />
                                    ) : (
                                        <SortAsc className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <TasksList
                        tasks={tasksData?.results || []}
                        selectedTaskSlug={selectedTaskSlug || undefined}
                        selectTask={handleSelectTask}
                        deleteTask={handleDeleteTask}
                        createTemplate={createTemplate}
                        changePagination={handlePaginationChange}
                        isFetching={tasksFetching}
                        isLoading={tasksLoading}
                        pagination={{
                            limit: Number(filterParams.limit) || 10,
                            offset: Number(filterParams.offset) || 0,
                            total: tasksData?.count || 0
                        }}
                    />
                    {
                        (tasksData?.results && tasksData.results.length === 0 && !tasksLoading && !tasksFetching) && (
                            <div className="text-center py-12 text-muted-foreground">
                                {isTemplates ? t(`templates-page.templates-absent-message`) : t(`tasks-page.tasks-absent-message`)}
                                {(filterParams.created_at__range || filterParams.name__icontains) && (
                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setFilterParams({ limit: 10, offset: 0 })
                                                setSearchValue('')
                                            }}
                                        >
                                            {t('fields.clear-filters')}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                    }
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} className="border-none rounded-none">
                <div className={isTemplates ? "h-[calc(100vh-64px-28px)]" : "h-[calc(100vh-64px-32px-32px-16px)]"}>
                    {renderTaskDetails()}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}