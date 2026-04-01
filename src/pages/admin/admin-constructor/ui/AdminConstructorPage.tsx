import { Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useAddAdminPanelNodeMutation, useAddAdminPanelNodeTabMutation, useDeleteAdminPanelNodeMutation, useDeleteAdminPanelNodeTabMutation, useGetAdminPanelNodesQuery, useUpdateAdminPanelNodeMutation, useUpdateAdminPanelNodeTabMutation } from "../../../../entities/admin/model/adminSlice"
import type { AdminPanelNode, AdminPanelNodeRequest } from "../../../../entities/admin/model/types"
import ConstructorNodeDetails from "../../../../features/constructor/constructor-node-details/ui/ConstructorNodeDetails"
import { ConstructorTree } from "../../../../features/constructor/constructor-tree"
import { errorsHandler } from "../../../../shared/lib/errors-handler"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../../../shared/ui/resizable"

const AdminConstructorPage = () => {
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null)
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const currentOrgId = Number(searchParams.get('org'))

    const { data: adminPanelNodes, isLoading: isLoadingAdminPanelNodes,isFetching: isFetchingAdminPanelNodes } = useGetAdminPanelNodesQuery(
        { organizationId: currentOrgId },
        { skip: !currentOrgId }
    )

    const [addAdminPanelNodeMutation] = useAddAdminPanelNodeMutation()
    const [updateAdminPanelNodeMutation] = useUpdateAdminPanelNodeMutation()
    const [deleteAdminPanelNodeMutation] = useDeleteAdminPanelNodeMutation()
    const [addAdminPanelNodeTabMutation] = useAddAdminPanelNodeTabMutation()
    const [updateAdminPanelNodeTabMutation] = useUpdateAdminPanelNodeTabMutation()
    const [deleteAdminPanelNodeTabMutation] = useDeleteAdminPanelNodeTabMutation()

    const handleSelectEntity = useCallback((nodeId: number) => {
        setSelectedNodeId(nodeId)
    }, [adminPanelNodes])

    const handleCreateEntity = async (body: AdminPanelNodeRequest) => {
        if (!currentOrgId) return

        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.creating-node')) as string
            await addAdminPanelNodeMutation({ organizationId: currentOrgId, body }).unwrap()
            toast.success(t('notice-list.node-created'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const handleEditEntity = async (node: AdminPanelNode, body: AdminPanelNodeRequest) => {
        if (!currentOrgId) return

        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.updating-node')) as string
            await updateAdminPanelNodeMutation({ organizationId: currentOrgId, nodeId: node.id, body }).unwrap()
            toast.success(t('notice-list.node-updated'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const handleDeleteEntity = async (node: AdminPanelNode) => {
        if (!currentOrgId) return

        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.deleting-node')) as string
            await deleteAdminPanelNodeMutation({ organizationId: currentOrgId, nodeId: node.id }).unwrap()
            toast.success(t('notice-list.node-deleted'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const handleAddNodeTab = async (body: {
        name_en: string
        name_ru: string
        related_structure_elements?: number[]
    }) => {
        if (!currentOrgId) return

        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.adding-node-tab')) as string
            await addAdminPanelNodeTabMutation({
                organizationId: currentOrgId,
                body: {
                    name_en: body.name_en,
                    name_ru: body.name_ru,
                    group: selectedNodeId || 0,
                    related_structure_elements: body.related_structure_elements || [],
                }
            }).unwrap()
            toast.success(t('notice-list.node-tab-added'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const handleUpdateNodeTab = async (tab: {
        id: number
        name_en: string
        name_ru: string
        related_structure_elements?: number[]
    }) => {
        if (!currentOrgId) return

        let toastId: string | undefined

        try {
            toastId = toast.loading(t('notice-list.updating-node-tab')) as string
            const node = adminPanelNodes?.find(node => node.id === selectedNodeId)

            const validNodeTabs = (() => {
                const targetTab = node?.pre_made_structure_elements?.find(element => element.id === tab.id)
                if(targetTab){
                    return node?.pre_made_structure_elements?.map(element => element.id === tab.id ? tab : element)
                }else{
                    return [...(node?.pre_made_structure_elements || []), tab]
                }
            })()
            await updateAdminPanelNodeTabMutation({
                organizationId: currentOrgId, body: {
                    id: tab.id,
                    group: selectedNodeId || 0,
                    name_en: tab.name_en,
                    name_ru: tab.name_ru,
                    related_structure_elements: tab.related_structure_elements || [],
                    structure_elements: validNodeTabs as { id: number, name_en: string, name_ru: string }[],
                }
            }).unwrap()

            toast.success(t('notice-list.node-tab-updated'

            ))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const handleDeleteNodeTab = async (tabId: number) => {
        if (!currentOrgId) return

        let toastId: string | undefined

        try {
            toastId = toast.loading(t('notice-list.deleting-node-tab')) as string
            await deleteAdminPanelNodeTabMutation({
                organizationId: currentOrgId, tabId
            }).unwrap()
            toast.success(t('notice-list.node-tab-deleted'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    const handleUpdateNode = async (node: AdminPanelNode) => {
        if (!currentOrgId) return

        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.updating-node')) as string
            await updateAdminPanelNodeMutation({ organizationId: currentOrgId, nodeId: node.id, body: node }).unwrap()
            toast.success(t('notice-list.node-updated'))
        } catch (error) {
            errorsHandler(error, t)
        } finally {
            toast.dismiss(toastId)
        }
    }

    return (
        <ResizablePanelGroup
            className="h-fit rounded-lg border border-border "
            orientation="horizontal"
        >
            <ResizablePanel
                defaultSize={100}
            >
                <div className="p-4 h-full w-full">
                    {isLoadingAdminPanelNodes || isFetchingAdminPanelNodes ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    ) : (!isLoadingAdminPanelNodes && adminPanelNodes?.length === 0) ? (
                        <div className="flex items-center justify-center h-full w-full">
                            <p className="text-sm text-muted-foreground">
                                {t('admin-page.no-nodes-available')}
                            </p>
                        </div>
                    ) : (
                        <div className="w-full h-full">
                            <ConstructorTree
                                nodes={adminPanelNodes || []}
                                onSelect={handleSelectEntity}
                                onEdit={handleEditEntity}
                                onDelete={handleDeleteEntity}
                                onCreate={handleCreateEntity}
                            />
                        </div>
                    )}
                </div>

            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} className="border-none rounded-none">
                <div className="h-[calc(100vh-64px-32px)] p-4">
                    {
                        !selectedNodeId && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">
                                    {t('admin-page.no-entity-selected')}
                                </p>
                            </div>
                        )
                    }
                    {selectedNodeId && (
                        <ConstructorNodeDetails
                            nodeId={selectedNodeId || 0}
                            addTab={handleAddNodeTab}
                            updateTab={handleUpdateNodeTab}
                            deleteTab={handleDeleteNodeTab}
                            updateNode={handleUpdateNode}
                        />
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default AdminConstructorPage