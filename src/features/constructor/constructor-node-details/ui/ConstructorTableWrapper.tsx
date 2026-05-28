'use client';

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    useAddAdminPanelGroupMutation,
    useAddAdminPanelRowMutation,
    useDeleteAdminPanelGroupMutation,
    useDeleteAdminPanelRowMutation,
    useUpdateAdminPanelGroupMutation,
    useUpdateAdminPanelRowMutation
} from "../../../../entities/admin/model/adminSlice";
import type { AdminPanelGroup, AdminPanelRowRequest } from "../../../../entities/admin/model/types";
import { errorsHandler } from "../../../../shared/lib/errors-handler";
import ConstructorTable from "../../constructor-table/ui/ConstructorTable";
import { useConstructorNodeContext } from "../model/ConstructorNodeContext";
import { useMemo } from "react";

interface DataItem {
    key: string
    [key: string]: any
}


interface Props {
    groups: AdminPanelGroup[]
    data: {
        entityId: number
        name_en: string
        name_ru: string
        organizationId: number
        type: 'group' | 'structure_element'
    }
    isShowTitle?: boolean
}

export interface ColumnConfig {
    key: string
    title: {
        en: string
        ru: string
    }
    inputType: AdminPanelGroup['type']
    width?: number
}

const ConstructorTableWrapper = ({ groups, data, isShowTitle = true }: Props) => {
    const { t } = useTranslation()

    const tableCoumns = (groups || []).map((group: AdminPanelGroup) => ({
        key: group.id.toString(),
        title: {
            en: group.name_en,
            ru: group.name_ru,
        },
        inputType: group.type,
        width: 100,
    }))

    const [addAdminPanelGroupMutation] = useAddAdminPanelGroupMutation()
    const [updateAdminPanelRow] = useUpdateAdminPanelRowMutation()
    const [deleteAdminPanelGroupMutation] = useDeleteAdminPanelGroupMutation()
    const [updateAdminPanelGroupMutation] = useUpdateAdminPanelGroupMutation()
    const [addAdminPanelRow] = useAddAdminPanelRowMutation()
    const [deleteAdminPanelRow] = useDeleteAdminPanelRowMutation()


    const { nodeId, tableRowsData, refetchRows } = useConstructorNodeContext()


    const onEdit = async (column: ColumnConfig) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.updating-group')) as string
            await updateAdminPanelGroupMutation({
                organizationId: data.organizationId,
                groupId: Number(column.key),
                body: {
                    name_en: column.title.en,
                    name_ru: column.title.ru,
                    [data.type]: data.entityId, type: column.inputType
                }
            }).unwrap()
            toast.success(t('notice-list.group-updated'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const onCreate = async (column: ColumnConfig) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.creating-group')) as string
            await addAdminPanelGroupMutation({
                organizationId: data.organizationId,
                body: {
                    name_en: column.title.en,
                    name_ru: column.title.ru,
                    // structure_element: node.id, 
                    [data.type]: data.entityId,
                    type: column.inputType
                }
            }).unwrap()
            toast.success(t('notice-list.group-created'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }
    const onDelete = async (columnKey: string) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.deleting-group')) as string
            await deleteAdminPanelGroupMutation({
                organizationId: data.organizationId,
                groupId: Number(columnKey)
            }).unwrap()
            toast.success(t('notice-list.group-deleted'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const onSaveRow = async (row: AdminPanelRowRequest['data']) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.saving-row')) as string
            await addAdminPanelRow({
                organizationId: data.organizationId,
                body: {
                    data: row,
                    group: nodeId ?? 0,
                    structure_element: data.type === 'structure_element' ? data.entityId : undefined
                }
            }).unwrap()
            await refetchRows()
            toast.success(t('notice-list.row-saved'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const onEditRow = async (rowKey: string, body: AdminPanelRowRequest['data']) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.editing-row')) as string
            await updateAdminPanelRow({
                organizationId: data.organizationId,
                rowId: Number(rowKey),
                body: {
                    data: body,
                    group: nodeId ?? 0,
                    structure_element: data.type === 'structure_element' ? data.entityId : undefined
                }
            })
            await refetchRows()
            toast.success(t('notice-list.row-edited'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const onDeleteRow = async (rowId: string) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.deleting-row')) as string
            await deleteAdminPanelRow({
                organizationId: data.organizationId,
                rowId: Number(rowId)
            }).unwrap()
            await refetchRows()
            toast.success(t('notice-list.row-deleted'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const tableRows = useMemo(() => {
        if (!tableRowsData) return []

        if (tableRowsData) {
            const keys = Object.keys(tableRowsData)
            const rowsItems: DataItem[] = []
            keys.forEach((key) => {
                const targetColumn = tableCoumns?.find(column => column.title?.en === key || column?.title?.ru === key)
                const responseKeyValues = tableRowsData[key]
                if (targetColumn && targetColumn?.key) {
                    if (Array.isArray(responseKeyValues) && responseKeyValues.length > 0) {
                        responseKeyValues.forEach((item, keyIndex) => {
                            if (!rowsItems[keyIndex]) {
                                rowsItems[keyIndex] = {
                                    key:''
                                }
                            }
                            rowsItems[keyIndex][targetColumn.key] = item.value
                            rowsItems[keyIndex].key = item?.id?.toString() || ''
                        })
                    }
                }
            })
           return rowsItems
        }
    }, [tableRowsData])

    return (
        <div >
            {isShowTitle && <h4 className="text-sm font-semibold mb-2">{t('admin-page.table')}</h4>}
            <ConstructorTable
                initialColumns={tableCoumns}
                initialRows={tableRows}
                onCreate={onCreate}
                onDelete={onDelete}
                onEdit={onEdit}
                onSaveRow={onSaveRow}
                onEditRow={onEditRow}
                onDeleteRow={onDeleteRow}
            />
        </div>
    )
}

export default ConstructorTableWrapper;