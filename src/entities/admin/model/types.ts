export interface AdminPanelTableColumn {
    id: number
    name_en: string
    name_ru: string
    structure_element: number
    structure_element_id: number
    group?: number
    type: string
}

export interface AdminPanelField {
    group: number
    id: number
    name_en: string
    name_ru: string
    structure_element: number
    type: string
    entityType?: 'group' | 'tab' | 'field' //добавил для удобства составления отчета
}

export interface AdminPanelNodeTab {
    id?: number
    name_en: string
    name_ru: string
    related_structure_elements?: number[]

    columns?: AdminPanelTableColumn[]
    nestLevel?: number //добавил для удобства вывода в tree и подсчета уровня вложенности
    entityType?: 'group' | 'tab' | 'field' //добавил для удобства составления отчета

    structure_element_fields?: AdminPanelField[]
}

export interface AdminPanelNode {
    id: number
    name_en: string
    name_ru: string
    organization: number
    parent: number
    related_groups: number[]
    pre_made_structure_elements?: AdminPanelNodeTab[]

    columns?: AdminPanelTableColumn[]

    nestLevel?: number //добавил для удобства вывода в tree и подсчета уровня вложенности
    entityType?: 'group' | 'tab' | 'field' //добавил для удобства составления отчета

    structure_element_fields?: AdminPanelField[]
}

export interface AdminPanelNodeRequest {
    name_en: string
    name_ru: string
    organization: number
    parent?: number
    related_groups?: number[]
    pre_made_structure_elements?: {
        id?:number
        name_en: string
        name_ru: string
        related_structure_elements?:number[]
    }[]
}

export interface AdminPanelColumn {
    id: number
    name_en: string
    name_ru: string
    structure_element: number
    structure_element_id: number
    group?: number
    type: string
}

export interface AdminPanelGroup {
    id: number
    name_en: string
    name_ru: string
    organization: number
    parent: number
    related_groups: number[]
    pre_made_structure_elements?: AdminPanelNodeTab[]

    columns?: AdminPanelTableColumn[]

    nestLevel?: number //добавил для удобства вывода в tree и подсчета уровня вложенности
    entityType?: 'group' | 'tab' | 'field' //добавил для удобства составления отчета

    structure_element_fields?: AdminPanelField[]
}

export interface AdminPanelGroupRequest {
    name_en: string
    name_ru: string
    structure_element?:number
    group?:number
    type:string
}