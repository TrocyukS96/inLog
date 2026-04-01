import { Loader2 } from "lucide-react"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { useGetAdminPanelNodesQuery } from "../../../../entities/admin/model/adminSlice"
import type { AdminPanelGroup, AdminPanelNode, AdminPanelNodeTab } from "../../../../entities/admin/model/types"
import { ReportDetails } from "../../../../features/report/report-details"
import { ReportTree } from "../../../../features/report/report-tree"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../../../shared/ui/resizable"

const AdminReportsPage = () => {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const currentOrgId = Number(searchParams.get('org'))
    const [reportData,setReportData] = useState<{
        nodes: AdminPanelNode[]
        tabs: AdminPanelNodeTab[]
        columns: AdminPanelGroup[]
    }>({
        nodes: [],
        tabs: [],
        columns: []
    })

    const { data: adminPanelNodes, isLoading: isLoadingAdminPanelNodes } = useGetAdminPanelNodesQuery(
        { organizationId: currentOrgId },
        { skip: !currentOrgId }
    )

    const createReport = useCallback((data: { nodes: AdminPanelNode[], tabs: AdminPanelNodeTab[], columns: AdminPanelGroup[] }) => {
        setReportData(data)
    }, [])

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
                    ) : !isLoadingAdminPanelNodes && adminPanelNodes?.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">
                                {t('admin-page.no-nodes-available')}
                            </p>
                        </div>
                    ) : (
                        <ReportTree
                            nodes={adminPanelNodes || []}
                            createReport={createReport}
                        />
                    )}

                </div>

            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60} className="border-none rounded-none">
                <div className="h-[calc(100vh-64px-32px)] p-4" >
                    <ReportDetails selectedEntities={reportData} />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default AdminReportsPage