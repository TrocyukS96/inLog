import { Tasks } from "../../../../../features/tasks"
import { useState } from "react"
import { Kanban, LayoutList } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "../../../../../shared/ui/tabs"
import TasksKanban from "../../../../../features/tasks/tasks-kanban"

const TasksPage = () => {
    const [viewMode, setViewMode] = useState<"list" | "kanban">("list")

    return (
        <div className="pl-2 space-y-4 min-w-0">
            <div className="flex justify-start">
                <Tabs
                    value={viewMode}
                    onValueChange={(value) => setViewMode(value as "list" | "kanban")}
                    className="w-auto"
                >
                    <TabsList className="grid w-[200px] grid-cols-2">
                        <TabsTrigger value="list" className="flex items-center gap-2 cursor-pointer">
                            <LayoutList className="h-4 w-4" />
                            <span>Список</span>
                        </TabsTrigger>
                        <TabsTrigger value="kanban" className="flex items-center gap-2 cursor-pointer">
                            <Kanban className="h-4 w-4" />
                            <span>Канбан</span>
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
            </div>

        </div>
    )
}

export default TasksPage