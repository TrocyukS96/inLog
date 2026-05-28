import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { useGenerateReportMutation } from "../../../../entities/admin/model/adminSlice"
import type { AdminPanelGroup, AdminPanelNode, AdminPanelNodeTab, AdminPanelReportRequest, AdminPanelReportTable } from "../../../../entities/admin/model/types"
import { errorsHandler } from "../../../../shared/lib/errors-handler"
import ReportTable from "./ReportTable"

interface ReportDetailsProps {
    selectedEntities: {
        nodes: AdminPanelNode[]
        tabs: AdminPanelNodeTab[]
        columns: AdminPanelGroup[]
    }
}

const ReportDetails = ({ selectedEntities }: ReportDetailsProps) => {
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const organizationId = Number(searchParams.get('org'))
    const [generateReport] = useGenerateReportMutation()
    const [reportData, setReportData] = useState<AdminPanelReportTable>({})
    const [isLoading, setIsLoading] = useState(false)

    const getValidRequestBody = useCallback((): AdminPanelReportRequest[] => {
        const data: AdminPanelReportRequest[] = []
        const { nodes, tabs, columns } = selectedEntities

        nodes.forEach(node => {
            data.push({
                group: node.id,
                fields: []
            })
        })
        
        tabs.forEach(tab => {
            data.push({
                element: tab.id,
                fields: []
            })
        })

        if (columns.length > 0) {
            data.forEach((item, i) => {
                const filteredFields = columns.filter(field => 
                    field.group === item.group || field.structure_element === item.element
                )
                if (filteredFields.length > 0) {
                    data[i] = { 
                        ...item, 
                        fields: [...item.fields, ...filteredFields.map(field => field.id)] 
                    }
                }
            })
        }
        
        return data
    }, [selectedEntities])

    const generateReportData = useCallback(async () => {
        if (!organizationId) return
        
        setIsLoading(true)
        try {
            const requestBody = getValidRequestBody()
            
            if (requestBody.length === 0) {
                setReportData({})
                return
            }

            const { data: response } = await generateReport({ 
                organizationId, 
                body: requestBody 
            })

            if (!response) {
                setReportData({})
                return
            }
            setReportData(response)
        } catch (error) {
            console.error('Error generating report:', error)
            errorsHandler(error, t)
            setReportData({})
        } finally {
            setIsLoading(false)
        }
    }, [selectedEntities, organizationId, generateReport, getValidRequestBody])

    useEffect(() => {
        generateReportData()
    }, [generateReportData])

    const handleRefresh = useCallback(() => {
        generateReportData()
    }, [generateReportData])

    return (
        <div className="h-full">
            <ReportTable 
                data={reportData}
                isLoading={isLoading}
                onRefresh={handleRefresh}
            />
        </div>
    )
}

export default ReportDetails