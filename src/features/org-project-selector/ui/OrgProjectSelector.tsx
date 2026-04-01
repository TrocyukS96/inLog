import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { useGetOrganizationsQuery } from '../../../entities/organization/model/organizationSlice'
import { useGetProjectsQuery } from '../../../entities/project/model/projectSlice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select'

interface Props {
    type?: 'all' | 'organization' | 'project'
}

const OrgProjectSelector = ({
    type = 'all',
}: Props) => {
    const { t } = useTranslation()
    // const [_orgOpen, setOrgOpen] = useState(false)
    // const [_projOpen, setProjOpen] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const [currentOrgId, setCurrentOrgId] = useState<number | null>(Number(searchParams.get('org')) || null)
    const [currentProjectId, setCurrentProjectId] = useState<number | null>(Number(searchParams.get('project')) || null)

    const { data: organizations = [], isLoading: orgsLoading } = useGetOrganizationsQuery()

    const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery(
        { organization: currentOrgId! },
        { skip: !currentOrgId }
    )

    const [_addOrgLoading, _setAddOrgLoading] = useState(false)
    const [_addProjLoading, _setAddProjLoading] = useState(false)

    // const orgSchema = z.object({
    //     fullName: z.string().min(1, t('fields.enter-full-name')),
    //     shortName: z.string().min(1, t('fields.enter-short-name')),
    //     address: z.string().min(1, t('fields.enter-address')),
    // })

    // const projectSchema = z.object({
    //     name: z.string().min(1, t('fields.enter-project-name')),
    // })

    useEffect(() => {
        const orgParam = searchParams.get('org')
        const projectParam = searchParams.get('project')

        if (orgParam && Number(orgParam)) {
            setCurrentOrgId(Number(orgParam))
        }

        if (projectParam && Number(projectParam)) {
            setCurrentProjectId(Number(projectParam))
        }
    }, [searchParams])

    useEffect(() => {
        const params = new URLSearchParams(searchParams)

        if (currentOrgId) {
            params.set('org', currentOrgId.toString())
        } else {
            params.delete('org')
        }

        if (currentProjectId) {
            params.set('project', currentProjectId.toString())
        } else {
            params.delete('project')
        }

        setSearchParams(params, { replace: true })
    }, [currentOrgId, currentProjectId, searchParams, setSearchParams])

    // Форма организации
    if (orgsLoading || projectsLoading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6 px-4 py-4 bg-card rounded-lg border border-border">
            {/* Организация */}
            {(type === 'all' || type === 'organization') && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t('scheduler-page.organization')}
                        </span>
                    </div>

                    {organizations.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-2">
                            {t('scheduler-page.no-organizations-yet')}
                        </div>
                    ) : (
                        <Select
                            value={currentOrgId?.toString() || ''}
                            onValueChange={(value) => {
                                const id = Number(value)
                                setCurrentOrgId(id)
                                setCurrentProjectId(null) // сбрасываем проект
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('scheduler-page.select-organization-first')} />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map(org => (
                                    <SelectItem key={org.id} value={org.id.toString()}>
                                        {org.fullName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            )}

            {/* Проект */}
            {(type === 'all' || type === 'project') && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            {t('scheduler-page.projects')}
                        </span>
                    </div>

                    {projects.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-2">
                            {t('scheduler-page.no-projects-in-organization')}
                        </div>
                    ) : (
                        <Select
                            value={currentProjectId?.toString() || ''}
                            onValueChange={(value) => setCurrentProjectId(Number(value))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('scheduler-page.select-project-first')} />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map(proj => (
                                    <SelectItem key={proj.id} value={proj.id.toString()}>
                                        {proj.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            )}
        </div>
    )
}

export default OrgProjectSelector