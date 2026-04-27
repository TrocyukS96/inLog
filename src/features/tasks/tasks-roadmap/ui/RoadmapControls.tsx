import { RoadmapFilter } from "./RoadmapFilter"
import type { TasksFilterParams } from "../../../../entities/task/model/types"
import type { RoadmapDetalizationMode } from "../model/types"
import RoadmapDetalization from "./RoadmapDetalization"
import { useSelector } from "react-redux"
import { makeSelectTaskStatuses } from "../../../../entities/task/model/selectors"
import { useSearchParams } from "react-router-dom"

interface Props{
    disabled: boolean
    initialValues: Partial<TasksFilterParams>
    viewMode: RoadmapDetalizationMode
    setViewMode:(viewMode: RoadmapDetalizationMode) => void
    onFilterChange:(params:Partial<TasksFilterParams>) => void
}


const RoadmapControls = (props: Props) => {
    const { disabled, initialValues, viewMode, setViewMode, onFilterChange } = props

    const [searchParams] = useSearchParams()

    const projectId = searchParams.get('project')

    const statuses = useSelector(makeSelectTaskStatuses(Number(projectId)))

    const handleFilterChange = (params: Partial<TasksFilterParams>) => {
        onFilterChange(params)
    }

    const handleReset = () => {
        onFilterChange(initialValues)
    }

    return (
        <div className="flex items-center gap-2 justify-end">
                <RoadmapFilter
                    statuses={statuses}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                    initialValues={initialValues}
                    disabled={disabled}
                />
                <RoadmapDetalization
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            </div>
    )
}

export default RoadmapControls