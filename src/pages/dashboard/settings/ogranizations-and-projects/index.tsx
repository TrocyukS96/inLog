import { Card, CardContent, CardHeader, CardTitle } from "../../../../shared/ui/card"
import { Button } from "../../../../shared/ui/button"
import { Link } from "react-router-dom"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { routes } from "../../../../shared/lib/routes"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDeleteOrganizationMutation, useGetOrganizationsQuery } from "../../../../entities/organization/model/organizationSlice"
import { useDeleteProjectMutation, useGetProjectsQuery } from "../../../../entities/project/model/projectSlice"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../../../shared/ui/alert-dialog"

const OrganizationsAndProjectsPage = () => {
    const { t } = useTranslation()

    const { data: organizations = [], isLoading: orgsLoading } = useGetOrganizationsQuery()

    const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)

    const { data: projects = [] } = useGetProjectsQuery(
        { organization: selectedOrgId! },
        { skip: !selectedOrgId }
    )
    const [deleteProject] = useDeleteProjectMutation()
    const [deleteOrganization] = useDeleteOrganizationMutation()

    const onDeleteOrganization = async (id: number) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.deleting-organization'))
            await deleteOrganization(id).unwrap()
            toast.success(t('notice-list.organization-deleted'))
            if (selectedOrgId === id) setSelectedOrgId(null)
        } catch {
            toast.error(t('errors.error-deleting-organization'))
        } finally {
            toast.dismiss(toastId)
        }
    }


    // Удалить проект
    const onDeleteProject = async (id: number) => {
        try {
            await deleteProject(id).unwrap()
            toast.success(t('notice-list.project-deleted'))
        } catch {
            toast.error(t('errors.error-deleting-project'))
        }
    }

    if (orgsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                        <CardTitle className="text-lg font-bold ">{t('settings-page.organizations')}</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link to={routes.organizations.new()}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('settings-page.new-organization')}
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {organizations.length === 0 ? (
                                <div className="text-center py-10 text-muted-foreground">
                                    {t('settings-page.no-organizations-yet')}
                                    <br />
                                    <Button variant="outline" className="mt-4" asChild>
                                        <Link to={routes.organizations.new()}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            {t('settings-page.create-first-organization')}
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                organizations.map((org) => (
                                    <div
                                        key={org.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedOrgId(org.id)}
                                    >
                                        <div>
                                            <p className="font-medium">{org.fullName}</p>
                                            <p className="text-sm text-muted-foreground">{org.shortName} • {org.address}</p>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{t('notice-list.confirm-delete-organization')}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {t('notice-list.confirm-delete-organization-description')}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={e => e.stopPropagation()}>{t('buttons.cancel')}</AlertDialogCancel>
                                                    <AlertDialogAction onClick={(e) => {
                                                        e.stopPropagation()
                                                        onDeleteOrganization(org.id)
                                                    }}>{t('buttons.continue')}</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                        <CardTitle className="text-lg font-bold ">{t('settings-page.projects')}</CardTitle>
                        <Button variant="outline" size="sm" disabled={!selectedOrgId} asChild>
                            <Link to={routes.projects.new()}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('settings-page.new-project')}
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {!selectedOrgId ? (
                            <div className="text-center py-10 text-muted-foreground">
                                {t('settings-page.select-organization-first')}
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                {t('settings-page.no-projects-in-organization')}
                                <br />
                                <Button variant="outline" className="mt-4" asChild>
                                    <Link to={routes.projects.new()}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        {t('settings-page.create-first-project')}
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {projects.map((project: any) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium">{project.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {t('settings-page.organization')}: {organizations.find(o => o.id === project.organization)?.fullName}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => onDeleteProject(project.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default OrganizationsAndProjectsPage