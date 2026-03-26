import { useTranslation } from 'react-i18next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../shared/ui/accordion"

import { AlertCircle, Loader2, RefreshCcw } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { adminApi, useGetAdminPanelNodeByIdQuery } from '../../../../entities/admin/model/adminSlice'
import type { AdminPanelGroup, AdminPanelNodeTab } from '../../../../entities/admin/model/types'
import { Button } from '../../../../shared/ui/button'
import ConstructorTableWrapper from './ConstructorTableWrapper'
import ConstructorTabs from './ConstructorTabs'
import { useDispatch } from 'react-redux'

export interface ColumnConfig {
    key: string
    title: {
        en: string
        ru: string
    }
    dataIndex: string
    inputType: AdminPanelGroup['type']
    width?: number
}

export interface DataItem {
    key: string
    [key: string]: any
}


interface ConstructorTableProps {
    nodeId: number
    handleAddNodeTab: (body: {
        name_en: string
        name_ru: string
    }) => void
    handleUpdateNodeTab: (tab: {
        id: number
        name_en: string
        name_ru: string
    }) => void
    handleDeleteNodeTab: (tabId: number) => void
}

const ConstructorNodeDetails = (props: ConstructorTableProps) => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language === 'ru' ? 'ru' : 'en'
    const [searchParams] = useSearchParams()
    const organizationId = Number(searchParams.get('org'))
    const dispatch = useDispatch()

    const { nodeId, handleAddNodeTab, handleUpdateNodeTab, handleDeleteNodeTab } = props

    const { data,isLoading,isError, isFetching } = useGetAdminPanelNodeByIdQuery({ organizationId: organizationId!, nodeId }, { skip: !organizationId || !nodeId })

    const tabs = useMemo(() => {
        return data?.pre_made_structure_elements?.map((tab: AdminPanelNodeTab, i: number, arr: AdminPanelNodeTab[]) =>
            tab.id ? tab : { ...tab, id: i === 0 ? 0 : arr[i - 1]?.id! + 1 }) || []
    }, [data])

    if (isLoading || isFetching) {
        return (
            <div className="h-full flex flex-col gap-4 items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('common.loading')}
            </div>
        )
    }
    if (isError) {
        return (
            <div className="h-full flex flex-col gap-4 items-center justify-center">
                <AlertCircle className="h-4 w-4" />
                {t('errors.error-loading-node')}
                <Button variant="outline" size="sm" onClick={() => {
                    dispatch(adminApi.util.invalidateTags(['Nodes', 'Node']))
                }}>
                    <RefreshCcw className="h-4 w-4" onClick={() => {
                        dispatch(adminApi.util.invalidateTags(['Nodes', 'Node']))
                    }} />
                    {t('buttons.refresh')}
                </Button>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{data?.[`name_${currentLang}`]}</h1>
                <Button variant="outline" size="sm" onClick={() => {
                    dispatch(adminApi.util.invalidateTags(['Nodes', 'Node']))
                }}>
                    <RefreshCcw className="h-4 w-4" />
                    {t('buttons.refresh')}
                </Button>
            </div>
            <Accordion
                type="multiple"
                className="mt-4"
                defaultValue={['table', 'tabs']}
            >
                <AccordionItem value="table">
                    <AccordionTrigger>{t('admin-page.table')}</AccordionTrigger>
                    <AccordionContent>
                        <ConstructorTableWrapper data={
                            {
                                entityId: data?.id || 0,
                                name_en: data?.name_en || '',
                                name_ru: data?.name_ru || '',
                                organizationId: data?.organization || 0,
                                type: 'group'
                            }} />

                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tabs">
                    <AccordionTrigger>{t('admin-page.tabs')}</AccordionTrigger>
                    <AccordionContent>
                        <ConstructorTabs
                            tabs={tabs}
                            handleAddNodeTab={handleAddNodeTab}
                            handleUpdateNodeTab={handleUpdateNodeTab}
                            handleDeleteNodeTab={handleDeleteNodeTab} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default ConstructorNodeDetails