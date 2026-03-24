import {
    hotkeysCoreFeature,
    selectionFeature,
    syncDataLoaderFeature,
    type FeatureImplementation
} from '@headless-tree/core'
import { useTree } from '@headless-tree/react'
import { FolderTree } from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AdminPanelNode, AdminPanelNodeRequest } from '../../../../entities/admin/model/types'
import { cn } from '../../../../shared/lib/utils'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../../shared/ui/dialog'
import { Button } from '../../../../shared/ui/button'
import { ConstructorTreeNode } from './ConstructorTreeNode'
import TreeNodeFormDialog from './TreeNodeFormDialog'

type TreeNodeData = number

interface Props {
    data: AdminPanelNode[]
    mode?: 'single' | 'multiple'
    selectedIds?: number[]
    onSelect?: (selectedIds: number[], selectedNodes: AdminPanelNode[]) => void
    onEdit?: (node: AdminPanelNode, body: AdminPanelNodeRequest) => void
    onDelete?: (node: AdminPanelNode) => void
    onCreate?: (body: AdminPanelNodeRequest) => void
    className?: string
}

const ConstructorTree = ({
    data,
    mode = 'single',
    // selectedIds = [],
    onSelect,
    onEdit,
    onDelete,
    onCreate,
    className = '',
}: Props) => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language === 'ru' ? 'ru' : 'en'

    const [dialogState, setDialogState] = useState<{
        open: boolean
        mode: 'create' | 'edit'
        node?: AdminPanelNode
        parentNode?: AdminPanelNode
    }>({
        open: false,
        mode: 'create',
    })

    const [deleteDialogState, setDeleteDialogState] = useState<{
        open: boolean
        node?: AdminPanelNode
    }>({
        open: false,
    })

    const nodesMap = useMemo(() => {
        const map = new Map<number, AdminPanelNode>()
        data.forEach(node => {
            map.set(node.id, node)
        })
        return map
    }, [data])

    const rootIds = useMemo(() => {
        return data
            .filter(node => node.parent === null || !nodesMap.has(node.parent))
            .map(node => node.id)
    }, [data, nodesMap])

    const handleOpenCreateDialog = useCallback((parentNode?: AdminPanelNode) => {
        setDialogState({
            open: true,
            mode: 'create',
            parentNode,
        })
    }, [])

    const handleOpenEditDialog = useCallback((node: AdminPanelNode) => {
        setDialogState({
            open: true,
            mode: 'edit',
            node,
        })
    }, [])

    const handleCloseDialog = useCallback(() => {
        setDialogState({
            open: false,
            mode: 'create',
        })
    }, [])

    const handleOpenDeleteDialog = useCallback((node: AdminPanelNode) => {
        setDeleteDialogState({
            open: true,
            node,
        })
    }, [])

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogState({
            open: false,
        })
    }, [])

    const handleConfirmDelete = useCallback(() => {
        if (deleteDialogState.node) {
            onDelete?.(deleteDialogState.node)
            handleCloseDeleteDialog()
        }
    }, [onDelete, deleteDialogState.node, handleCloseDeleteDialog])

    const handleConfirmCreate = useCallback(async (formData: { name_ru: string; name_en: string; related_groups: string[] }) => {
        onCreate?.({
            name_ru: formData.name_ru,
            name_en: formData.name_en,
            parent: dialogState.parentNode?.id || 0,
            organization: dialogState.parentNode?.organization || 0,
            related_groups: formData.related_groups.map(Number) || [],
        })
        handleCloseDialog()
    }, [onCreate, dialogState.parentNode])

    const handleConfirmEdit = useCallback(async (formData: { name_ru: string; name_en: string; related_groups: string[] }) => {
        if (dialogState.node) {
            onEdit?.(dialogState.node, {
                name_ru: formData.name_ru,
                name_en: formData.name_en,
                organization: dialogState.node.organization,
                related_groups: formData.related_groups.map(Number) || [],
            })
            handleCloseDialog()
        }
    }, [onEdit, dialogState.node, handleCloseDialog])

    const customClickBehavior: FeatureImplementation = useMemo(() => ({
        itemInstance: {
            getProps: ({ tree, item, prev }) => ({
                ...prev?.(),
                onDoubleClick: (e: MouseEvent) => {
                    e.stopPropagation()
                    if (item.isFolder()) {
                        if (item.isExpanded()) {
                            item.collapse()
                        } else {
                            item.expand()
                        }
                    }
                },
                onClick: () => {
                    const selectedItemId = item.getItemMeta().itemId
                    tree.setSelectedItems([selectedItemId])
                    item.setFocused()

                    const selectedNode = nodesMap.get(Number(selectedItemId))
                    if (selectedNode) {
                        onSelect?.([selectedNode.id], [selectedNode])
                    }
                },
            }),
        },
    }), [nodesMap, onSelect])

    const tree = useTree<TreeNodeData>({
        rootItemId: '__root__',
        getItemName: (item) => {
            const node = nodesMap.get(item.getItemData())
            if (!node) return ''
            return currentLang === 'ru' ? node.name_ru : node.name_en
        },
        isItemFolder: (item) => {
            const node = nodesMap.get(item.getItemData())
            if (!node) return false
            return data.some(child => child.parent === node.id)
        },
        dataLoader: {
            getItem: (itemId) => {
                if (itemId === '__root__') return null as any
                return Number(itemId) as TreeNodeData
            },
            getChildren: (itemId) => {
                if (itemId === '__root__') {
                    return rootIds.map(id => id.toString())
                }
                const nodeId = Number(itemId)
                const children = data.filter(node => node.parent === nodeId)
                return children.map(child => child.id.toString())
            },
        },
        features: [
            syncDataLoaderFeature,
            selectionFeature,
            hotkeysCoreFeature,
            customClickBehavior,
        ],
    })

    const allNodesCount = data.length

    const handleToggle = useCallback((item: any) => {
        if (item.isExpanded()) {
            item.collapse()
        } else {
            item.expand()
        }
    }, [])

    return (
        <>
            <div className={cn("w-full h-full", className)}>
                {allNodesCount === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                        <FolderTree className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground">
                            {t('admin-page.no-nodes-available')}
                        </p>
                    </div>
                ) : (
                    <div {...tree.getContainerProps()} className="space-y-0.5">
                        {tree.getItems().map((item: any) => {
                            const nodeId = item.getItemData()
                            const node = nodesMap.get(nodeId)
                            const level = item.getItemMeta().level

                            if (!node) return null

                            return (
                                <ConstructorTreeNode
                                    key={item.getId()}
                                    item={item}
                                    node={node}
                                    mode={mode}
                                    onToggle={handleToggle}
                                    onEdit={() => handleOpenEditDialog(node)}
                                    onDelete={level > 0 ? () => handleOpenDeleteDialog(node) : undefined}
                                    onCreate={() => handleOpenCreateDialog(node)}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
            <TreeNodeFormDialog
                open={dialogState.open}
                onOpenChange={handleCloseDialog}
                mode={dialogState.mode}
                node={dialogState.node}
                parentNode={dialogState.parentNode}
                allNodes={data}
                onConfirm={dialogState.mode === 'create' ? handleConfirmCreate : handleConfirmEdit}
                isLoading={false}
            />

            <Dialog open={deleteDialogState.open} onOpenChange={handleCloseDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{t('admin-page.delete-node-title')}</DialogTitle>
                        <DialogDescription>
                            {deleteDialogState.node && (
                                <p>
                                        {t('admin-page.delete-node-warning')}
                                </p>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDeleteDialog}>
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            {t('buttons.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default memo(ConstructorTree)