import { useTranslation } from 'react-i18next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../shared/ui/accordion"

import ConstructorTable from '../../constructor-table/ui/ConstructorTable'
import ConstructorTabs from './ConstructorTabs'
import { useMemo } from 'react'
import type { AdminPanelNode, AdminPanelNodeTab } from '../../../../entities/admin/model/types'

export type ColumnType = 'text' | 'number' | 'date' | 'file'

export interface ColumnConfig {
    key: string
    title: {
        en: string
        ru: string
    }
    dataIndex: string
    inputType: ColumnType
    width?: number
}
    
export interface DataItem {
    key: string
    [key: string]: any
}


interface ConstructorTableProps {
    node: AdminPanelNode
    initialColumns?: ColumnConfig[]
    initialData?: DataItem[]
}

const ConstructorEntityContent = ({ node, initialColumns, initialData }: ConstructorTableProps) => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language === 'ru' ? 'ru' : 'en'

    const tabs = useMemo(() => {
        return node.pre_made_structure_elements?.map((tab: AdminPanelNodeTab,i: number, arr: AdminPanelNodeTab[]) =>
            tab.id ? tab : { ...tab, id: i === 0 ? 0 : arr[i - 1]?.id! + 1 }) || []
    }, [node])

    return (
        <div>
            <h1 className="text-2xl font-bold">{node[`name_${currentLang}`]}</h1>
            <Accordion
                type="multiple"
                className="mt-4"
                defaultValue={['table', 'tabs']}
            >
                <AccordionItem value="table">
                    <AccordionTrigger>{t('admin-page.table')}</AccordionTrigger>
                    <AccordionContent>
                        <ConstructorTable node={node} initialColumns={initialColumns} initialData={initialData} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tabs">
                    <AccordionTrigger>{t('admin-page.tabs')}</AccordionTrigger>
                    <AccordionContent>
                        <ConstructorTabs tabs={tabs } />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default ConstructorEntityContent