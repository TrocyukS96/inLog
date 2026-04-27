import type { DateRange } from "react-day-picker"
import type { TaskTypeFilter } from "../ui/TasksFilter"

export interface TasksFilterValues {
    dateRange?: DateRange
    taskType?: TaskTypeFilter
}