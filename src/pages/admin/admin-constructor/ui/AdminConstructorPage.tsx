import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useAddAdminPanelNodeMutation, useDeleteAdminPanelNodeMutation, useGetAdminPanelNodesQuery, useUpdateAdminPanelNodeMutation } from "../../../../entities/admin/model/adminSlice"
import type { AdminPanelNode, AdminPanelNodeRequest } from "../../../../entities/admin/model/types"
import ConstructorEntityContent from "../../../../features/constructor/constructor-entity-content/ui/ConstructorEntityContent"
import { ConstructorTree } from "../../../../features/constructor/constructor-tree"
import { errorsHandler } from "../../../../shared/lib/errors-handler"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../../../shared/ui/resizable"

const AdminConstructorPage = () => {
    const [selectedNode, setSelectedNode] = useState<AdminPanelNode | null>(null)
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

    const handleSelectEntity = (selectedIds: number[], selectedNodes: any[]) => {
        if (selectedIds.length > 0) {
            setSelectedNode(selectedNodes[0])
        }
    }

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
                        <ConstructorTree
                            data={adminPanelNodes || []}
                            onSelect={handleSelectEntity}
                            onEdit={handleEditEntity}
                            onDelete={handleDeleteEntity}
                            onCreate={handleCreateEntity}
                        />
                    )}
                </div>

            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} className="border-none rounded-none">
                <div className="h-[calc(100vh-64px-32px)] p-4">
                    {
                        !selectedNode && (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground">
                                    {t('admin-page.no-entity-selected')}
                                </p>
                            </div>
                        )
                    }
                    {selectedNode && (
                        <ConstructorEntityContent node={selectedNode} />
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default AdminConstructorPage