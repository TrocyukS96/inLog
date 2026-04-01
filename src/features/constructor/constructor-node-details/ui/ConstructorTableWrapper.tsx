'use client';

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    useAddAdminPanelGroupMutation,
    useDeleteAdminPanelGroupMutation,
    useGetAdminPanelGroupsQuery,
    useUpdateAdminPanelGroupMutation
} from "../../../../entities/admin/model/adminSlice";
import type { AdminPanelGroup } from "../../../../entities/admin/model/types";
import { errorsHandler } from "../../../../shared/lib/errors-handler";
import ConstructorTable from "../../constructor-table/ui/ConstructorTable";

interface Props {
    data: {
        entityId: number
        name_en: string
        name_ru: string
        organizationId: number
        type: 'group' | 'structure_element'
    }
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

const ConstructorTableWrapper = ({ data }: Props) => {
    const { t } = useTranslation()
    const { data: groups } = useGetAdminPanelGroupsQuery({
        [data.type]: data.entityId,
        organizationId: data.organizationId,
    }, {
        skip: !data.entityId
    })

    const [addAdminPanelGroupMutation] = useAddAdminPanelGroupMutation()
    const [deleteAdminPanelGroupMutation] = useDeleteAdminPanelGroupMutation()
    const [updateAdminPanelGroupMutation] = useUpdateAdminPanelGroupMutation()

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

    return (
        <div >
            <h4 className="text-sm font-semibold mb-2">{t('admin-page.table')}</h4>
            <ConstructorTable
                initialColumns={(groups || []).map((group: AdminPanelGroup) => ({
                    key: group.id.toString(),
                    title: {
                        en: group.name_en,
                        ru: group.name_ru,
                    },
                    inputType: group.type,
                    width: 100,
                }))}
                onCreate={onCreate}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </div>
    )
}

export default ConstructorTableWrapper;