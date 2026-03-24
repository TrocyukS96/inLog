import type { AdminPanelNode } from "../../../entities/admin/model/types"

export const getSelectedEntities = (
    prevSelected: AdminPanelNode[],
    entity: AdminPanelNode
): AdminPanelNode[] => {
    const isSelected = prevSelected.some(item => item.id === entity.id)
    
    if (isSelected) {
        return prevSelected.filter(item => item.id !== entity.id)
    } else {
        return [...prevSelected, entity]
    }
}

export const findAllParentNodes = (
    nodes: AdminPanelNode[],
    parentId: number | null,
    result: AdminPanelNode[] = []
): AdminPanelNode[] => {
    if (!parentId) return result
    
    const parent = nodes.find(node => node.id === parentId)
    if (parent) {
        result.unshift(parent)
        return findAllParentNodes(nodes, parent.parent, result)
    }
    return result
}

export const findRelativeTabsInNodes = (
    nodes: AdminPanelNode[],
    nodeId: number | null,
) => {
    const result: AdminPanelNode[] = []
    let targetEntity = null as null | AdminPanelNode

    nodes?.forEach((node: AdminPanelNode) => {
        const parentNodes = findAllParentNodes(nodes, node.id);
        const item = { ...node, nestLevel: parentNodes ? parentNodes.length : 0 }

        if (item.id === nodeId) {
            targetEntity = item
        }

        result.push(item)
        //возвращает массив дочерних узлов
    })

    if (targetEntity && targetEntity.nestLevel && result.length > 0) {
        return result.filter(item => item.nestLevel && item.nestLevel <= targetEntity?.nestLevel!)
    } else return []

   //эта функция возвращает массив родительских узлов
}
