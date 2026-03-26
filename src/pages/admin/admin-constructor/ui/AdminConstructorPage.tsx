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

    const { data: adminPanelNodes, isLoading: isLoadingAdminPanelNodes } = useGetAdminPanelNodesQuery(
        { organizationId: currentOrgId },
        { skip: !currentOrgId }
    )

    const [addAdminPanelNodeMutation] = useAddAdminPanelNodeMutation()
    const [updateAdminPanelNodeMutation] = useUpdateAdminPanelNodeMutation()
    const [deleteAdminPanelNodeMutation] = useDeleteAdminPanelNodeMutation()
    const [addAdminPanelNodeTabMutation] = useAddAdminPanelNodeTabMutation()
    const [updateAdminPanelNodeTabMutation] = useUpdateAdminPanelNodeTabMutation()
    const [deleteAdminPanelNodeTabMutation] = useDeleteAdminPanelNodeTabMutation()


    console.log(adminPanelNodes, '--adminPanelNodes')

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
    }) => {
        if (!currentOrgId) return

        let toastId: string | undefined

        try {
            toastId = toast.loading(t('notice-list.updating-node-tab')) as string
            const node = adminPanelNodes?.find(node => node.id === selectedNodeId)
            await updateAdminPanelNodeTabMutation({
                organizationId: currentOrgId, body: {
                    id: tab.id,
                    group: selectedNodeId || 0,
                    name_en: tab.name_en,
                    name_ru: tab.name_ru,
                    structure_elements: [
                        ...(node?.pre_made_structure_elements || []),
                        {
                            id: tab.id,
                            name_en: tab.name_en,
                            name_ru: tab.name_ru,
                        }
                    ] as { id: number, name_en: string, name_ru: string }[]
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

    return (
        <ResizablePanelGroup
            className="h-fit rounded-lg border border-border "
            orientation="horizontal"
        >
            <ResizablePanel
                defaultSize={100}
            >
                <div className="p-4 h-full w-full">
                    {isLoadingAdminPanelNodes ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    ) : (
                        <div>
                            <ConstructorTree
                                nodes={adminPanelNodes || []}
                                onSelect={handleSelectEntity}
                                onEdit={handleEditEntity}
                                onDelete={handleDeleteEntity}
                                onCreate={handleCreateEntity}
                            />
                            {/* <div className="mt-4 h-200">
                                <ScrollArea
                                    className="h-full">
                                    {adminPanelNodes?.map((node) => (
                                        <Card className="mt-2 cursor-pointer hover:bg-accent/50 transition-colors" key={node.id}>
                                            <div className=" p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-medium">{node.name_ru}</div>
                                                </div>
                                                <Button variant="outline" size="sm" onClick={() => handleDeleteEntity(node)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </ScrollArea>
                            </div> */}
                        </div>

                    )}
                    {(!isLoadingAdminPanelNodes && adminPanelNodes?.length === 0) && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">
                                {t('admin-page.no-nodes-available')}
                            </p>
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
                            handleAddNodeTab={handleAddNodeTab}
                            handleUpdateNodeTab={handleUpdateNodeTab}
                            handleDeleteNodeTab={handleDeleteNodeTab}
                        />
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default AdminConstructorPage