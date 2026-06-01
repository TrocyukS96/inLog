import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui/card"
import { Button } from "../../../shared/ui/button"
import { Loader2, Plus, Trash2, Building2, FolderOpen } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDeleteOrganizationMutation, useGetOrganizationsQuery } from "../../../entities/organization/model/organizationSlice"
import { useDeleteProjectMutation, useGetProjectsQuery } from "../../../entities/project/model/projectSlice"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../shared/ui/alert-dialog"
import { CreateProjectDialog } from "./CreateProjectDialog"
import { cn } from "../../../shared/lib/utils"
import { CreateOrganizationDialog } from "./CreateOrganizationDialog"

const OrganizationsAndProjects = () => {
    const { t } = useTranslation()
    const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)
    const [orgToDelete, setOrgToDelete] = useState<number | null>(null)
    const [isCreateOrgOpen, setIsCreateOrgOpen] = useState(false)
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)

    const { data: organizations = [], isLoading: orgsLoading } = useGetOrganizationsQuery()
    
    const { 
        data: projects = [], 
        isLoading: projectsLoading,
        isFetching: projectsFetching 
    } = useGetProjectsQuery(
        { organization: selectedOrgId! },
        { skip: !selectedOrgId }
    )

    const [deleteProject, { isLoading: isDeletingProject }] = useDeleteProjectMutation()
    const [deleteOrganization, { isLoading: isDeletingOrg }] = useDeleteOrganizationMutation()

    const onDeleteOrganization = async () => {
        if (!orgToDelete) return
        
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.deleting-organization'))
            await deleteOrganization(orgToDelete).unwrap()
            toast.success(t('notice-list.organization-deleted'))
            if (selectedOrgId === orgToDelete) setSelectedOrgId(null)
            setOrgToDelete(null)
        } catch {
            toast.error(t('errors.error-deleting-organization'))
        } finally {
            toast.dismiss(toastId)
        }
    }

    const onDeleteProject = async (id: number) => {
        let toastId: string | undefined
        try {
            toastId = toast.loading(t('notice-list.deleting-project'))
            await deleteProject(id).unwrap()
            toast.success(t('notice-list.project-deleted'))
        } catch {
            toast.error(t('errors.error-deleting-project'))
        } finally {
            toast.dismiss(toastId)
        }
    }

    const handleSelectOrganization = (orgId: number) => {
        setSelectedOrgId(orgId)
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
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            {t('settings-page.organizations')}
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setIsCreateOrgOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t('settings-page.new-organization')}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {organizations.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground border border-border/50 rounded-lg">
                                <Building2 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                                <p className="mb-4">{t('scheduler-page.no-organizations-yet')}</p>
                                <Button variant="outline" onClick={() => setIsCreateOrgOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('scheduler-page.create-first-organization')}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {organizations.map((org) => (
                                    <div
                                        key={org.id}
                                        className={cn(
                                            "flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer",
                                            selectedOrgId === org.id 
                                                ? "border-primary bg-primary/5 shadow-sm" 
                                                : "border-border/50 hover:border-primary/30 hover:bg-accent/50"
                                        )}
                                        onClick={() => handleSelectOrganization(org.id)}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{org.fullName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {org.shortName} • {org.address}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setOrgToDelete(org.id)
                                            }}
                                            disabled={isDeletingOrg}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <FolderOpen className="h-5 w-5 text-muted-foreground" />
                            {t('settings-page.projects')}
                        </CardTitle>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={!selectedOrgId}
                            onClick={() => setIsCreateProjectOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('settings-page.new-project')}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {!selectedOrgId ? (
                            <div className="text-center py-10 text-muted-foreground border border-border/50 rounded-lg">
                                <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                                <p>{t('settings-page.select-organization-first')}</p>
                            </div>
                        ) : projectsLoading || projectsFetching ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground border border-border/50 rounded-lg">
                                <FolderOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                                <p className="mb-4">{t('scheduler-page.no-projects-in-organization')}</p>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsCreateProjectOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {t('settings-page.create-first-project')}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {projects.map((project: any) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
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
                                            disabled={isDeletingProject}
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

            {/* Delete Organization Dialog */}
            <AlertDialog open={!!orgToDelete} onOpenChange={() => setOrgToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('notice-list.confirm-delete-organization')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('notice-list.confirm-delete-organization-description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingOrg}>
                            {t('buttons.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={onDeleteOrganization}
                            disabled={isDeletingOrg}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isDeletingOrg ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {t('buttons.deleting')}
                                </>
                            ) : (
                                t('buttons.delete')
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Create Dialogs */}
            <CreateOrganizationDialog 
                open={isCreateOrgOpen}
                onOpenChange={setIsCreateOrgOpen}
            />
            
            <CreateProjectDialog
                open={isCreateProjectOpen}
                onOpenChange={setIsCreateProjectOpen}
                organizationId={selectedOrgId}
            />
        </div>
    )
}

export default OrganizationsAndProjects