import { Filter } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "../../../shared/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../shared/ui/dialog"

// interface TasksFilterProps {
//     filterParams?: TasksFilterParams
//     setFilterParams?: (params: Partial<Omit<TasksFilterParams, 'projectId'>>) => void
// }

const TasksFilter = () => {
    const { t } = useTranslation()
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    return (
        <>
            <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        {t('tasks-page.filters')}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('tasks-page.filters')}</DialogTitle>
                    </DialogHeader>
                    {/* <TaskFilterModal
                filterParams={filterParams}
                setFilterParams={handleFilterChange}
                onClose={() => setFilterModalOpen(false)}
              /> */}
                </DialogContent>
            </Dialog>
        </>
    )
}

            export default TasksFilter