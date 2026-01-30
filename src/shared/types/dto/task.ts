export interface TaskCreate {
    name: string
    title: string
    description: string
    priority: 'low' | 'medium' | 'important' | 'critical'
    project: number
    parent: number
    status: number
    due_date_start: string
    due_date_end: string
    is_template: boolean
}

export interface TaskUpdate {
    name: string
    description: string
    priority: 'low' | 'medium' | 'important' | 'critical'
    status: number
    status_position: number
    due_date_start: string
    due_date_end: string
    tags: number[]
    supervisor: {
        email: string
        name: string
        organization: string
        position: string
        work_phone: string
        mobile_phone: string
    }
    equipment: number
    archived: boolean
    is_template: boolean
}