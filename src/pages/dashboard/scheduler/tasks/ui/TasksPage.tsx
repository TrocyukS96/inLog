import { Tasks } from "../../../../../features/tasks"
import { useState } from "react"
import { Calendar, Kanban, LayoutList } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "../../../../../shared/ui/tabs"
import TasksKanban from "../../../../../features/tasks/tasks-kanban"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { cn } from "../../../../../shared/lib/utils"
import { TasksRoadmap } from "../../../../../features/tasks/tasks-roadmap"

type ViewMode = "list" | "kanban" | "roadmap"

const TasksPage = () => {
    const { t } = useTranslation()
    const [viewMode, setViewMode] = useState<ViewMode>("list")
    const [searchParams] = useSearchParams()
    const projectId = searchParams.get('project')

    return (
        <div className="space-y-4 min-w-0">
            <div className="flex justify-start">
                <Tabs
                    value={viewMode}
                    onValueChange={(value) => setViewMode(value as ViewMode)}
                    className="w-auto"
                >
                    <TabsList className="grid w-[400px] grid-cols-3">
                        <TabsTrigger disabled={!projectId} value="list" className={cn("flex items-center gap-2 cursor-pointer", !projectId && "opacity-50 cursor-not-allowed")}>
                            <LayoutList className="h-4 w-4" />
                            <span>{t('buttons.list')}</span>
                        </TabsTrigger>
                        <TabsTrigger disabled={!projectId} value="kanban" className={cn("flex items-center gap-2 cursor-pointer", !projectId && "opacity-50 cursor-not-allowed")}>
                            <Kanban className="h-4 w-4" />
                            <span>{t('buttons.kanban')}</span>
                        </TabsTrigger>
                        <TabsTrigger disabled={!projectId} value="roadmap" className={cn("flex items-center gap-2 cursor-pointer", !projectId && "opacity-50 cursor-not-allowed")}>
                            <Calendar className="h-4 w-4" />
                            <span>{t('buttons.roadmap')}</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="h-full">
                {viewMode === "list" && <Tasks />}
                {viewMode === "kanban" && (
                    <div className="h-full w-full overflow-hidden min-w-0">
                        <TasksKanban />
                    </div>
                )}
                {viewMode === "roadmap" && (
                    <div className="h-full w-full overflow-hidden min-w-0">
                        <TasksRoadmap />
                    </div>
                )}
            </div>

        </div>
    )
}

export default TasksPage