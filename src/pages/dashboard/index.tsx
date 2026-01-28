import {
    ChevronRight,
    FolderKanban,
    ListTodo,
    Loader2,
    Map,
    Plus, Trash2
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '../../shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card'

import {
    useDeleteOrganizationMutation,
    useGetOrganizationsQuery
} from '../../entities/organization/model/organizationSlice'

import {
    useDeleteProjectMutation,
    useGetProjectsQuery
} from '../../entities/project/model/projectSlice'

import { routes } from '../../shared/lib/routes'

// const organizationSchema = z.object({
//   fullName: z.string().min(1, 'Введите полное название'),
//   shortName: z.string().min(1, 'Введите краткое название'),
//   address: z.string().min(1, 'Введите адрес'),
// })

// const projectSchema = z.object({
//   name: z.string().min(1, 'Введите название проекта'),
//   organizationId: z.number().min(1, 'Выберите организацию'),
// })

// type OrganizationForm = z.infer<typeof organizationSchema>
// type ProjectForm = z.infer<typeof projectSchema>

export default function DashboardPage() {
  const { t } = useTranslation()

  // Организации
  const { data: organizations = [], isLoading: orgsLoading } = useGetOrganizationsQuery()
  const [deleteOrg] = useDeleteOrganizationMutation()

  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null)

  const { data: projects = []} = useGetProjectsQuery(
    { organization: selectedOrgId! },
    { skip: !selectedOrgId }
  )
  const [deleteProject] = useDeleteProjectMutation()

//   // Форма организации
//   const orgForm = useForm<OrganizationForm>({
//     resolver: zodResolver(organizationSchema),
//     defaultValues: { fullName: '', shortName: '', address: '' },
//   })

//   // Форма проекта
//   const projectForm = useForm<ProjectForm>({
//     resolver: zodResolver(projectSchema),
//     defaultValues: { name: '', organizationId: 0 },
//   })

  // Удалить организацию
  const onDeleteOrg = async (id: number) => {
    if (!confirm(t('confirm-delete-organization'))) return
    try {
      await deleteOrg(id).unwrap()
      toast.success(t('organization-deleted'))
      if (selectedOrgId === id) setSelectedOrgId(null)
    } catch {
      toast.error(t('error-deleting-organization'))
    }
  }


  // Удалить проект
  const onDeleteProject = async (id: number) => {
    if (!confirm(t('confirm-delete-project'))) return
    try {
      await deleteProject(id).unwrap()
      toast.success(t('project-deleted'))
    } catch {
      toast.error(t('error-deleting-project'))
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
    <div className="space-y-10">
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Добро пожаловать в inLog
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Лабораторная информационная система для управления исследованиями керна и данными скважин
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            Здесь вы можете создавать организации, проекты, загружать данные по кустам, скважинам, кернам, проводить измерения и отслеживать статусы.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickLinkCard
              icon={<FolderKanban className="h-6 w-6" />}
              title={t('projects')}
              description="Управление проектами и кустами"
              to={routes.projects.list()}
            />
            <QuickLinkCard
              icon={<ListTodo className="h-6 w-6" />}
              title={t('tasks')}
              description="Планирование задач и статусов"
              to={routes.scheduler.tasks()}
            />
            <QuickLinkCard
              icon={<Map className="h-6 w-6" />}
              title={t('roadmap')}
              description="Дорожная карта исследований"
              to={routes.scheduler.roadmap()}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('organizations')}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to={routes.organizations.new()}>
                <Plus className="h-4 w-4 mr-2" />
                {t('new-organization')}
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {organizations.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  {t('no-organizations-yet')}
                  <br />
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to={routes.organizations.new()}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('create-first-organization')}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteOrg(org.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('projects')}</CardTitle>
            <Button variant="outline" size="sm" disabled={!selectedOrgId} asChild>
              <Link to={routes.projects.new()}>
                <Plus className="h-4 w-4 mr-2" />
                {t('new-project')}
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!selectedOrgId ? (
              <div className="text-center py-10 text-muted-foreground">
                {t('select-organization-first')}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {t('no-projects-in-organization')}
                <br />
                <Button variant="outline" className="mt-4" asChild>
                  <Link to={routes.projects.new()}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('create-first-project')}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project:any) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('organization')}: {organizations.find(o => o.id === project.organization)?.fullName}
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

function QuickLinkCard({
  icon,
  title,
  description,
  to,
}: {
  icon: React.ReactNode
  title: string
  description: string
  to: string
}) {
  return (
    <Button asChild variant="outline" className="h-auto py-6 px-6 flex flex-col items-start gap-2 hover:bg-primary/5">
      <Link to={to}>
        <div className="text-primary">{icon}</div>
        <div className="font-medium">{title}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <ChevronRight className="h-4 w-4 mt-2" />
      </Link>
    </Button>
  )
}