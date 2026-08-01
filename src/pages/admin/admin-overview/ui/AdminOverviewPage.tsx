import {
  Building2,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  UserCheck,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  useGetAdminMembersQuery,
  useGetAdminOrganizationsQuery,
  useGetAdminProjectsQuery,
  useGetAdminTasksQuery,
  useGetAdminUsersQuery,
} from '../../../../entities/platform-admin/model/platformAdminSlice'
import { routes } from '../../../../shared/lib/routes'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../shared/ui/card'
import { Skeleton } from '../../../../shared/ui/skeleton'

const statCards = [
  {
    key: 'users',
    route: routes.admin.users(),
    icon: Users,
    color: 'text-blue-600 bg-blue-500/10',
  },
  {
    key: 'members',
    route: routes.admin.members(),
    icon: UserCheck,
    color: 'text-cyan-600 bg-cyan-500/10',
  },
  {
    key: 'organizations',
    route: routes.admin.organizations(),
    icon: Building2,
    color: 'text-violet-600 bg-violet-500/10',
  },
  {
    key: 'projects',
    route: routes.admin.projects(),
    icon: FolderKanban,
    color: 'text-emerald-600 bg-emerald-500/10',
  },
  {
    key: 'tasks',
    route: routes.admin.tasks(),
    icon: CheckSquare,
    color: 'text-amber-600 bg-amber-500/10',
  },
] as const

export function AdminOverviewPage() {
  const { t } = useTranslation()

  const users = useGetAdminUsersQuery({ limit: 1, offset: 0 })
  const members = useGetAdminMembersQuery({ limit: 1, offset: 0, type: 'project' })
  const organizations = useGetAdminOrganizationsQuery({ limit: 1, offset: 0 })
  const projects = useGetAdminProjectsQuery({ limit: 1, offset: 0 })
  const tasks = useGetAdminTasksQuery({ limit: 1, offset: 0 })

  const counts = {
    users: users.data?.count,
    members: members.data?.count,
    organizations: organizations.data?.count,
    projects: projects.data?.count,
    tasks: tasks.data?.count,
  }

  const isLoading =
    users.isLoading ||
    members.isLoading ||
    organizations.isLoading ||
    projects.isLoading ||
    tasks.isLoading

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-primary">
          <LayoutDashboard className="h-5 w-5" />
          <h2 className="text-xl font-semibold tracking-tight">{t('admin-page.overview')}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{t('admin-page.overview-description')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {statCards.map(({ key, route, icon: Icon, color }) => (
          <Link key={key} to={route} className="group">
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`admin-page.overview-cards.${key}`)}
                </CardTitle>
                <div className={`rounded-lg p-2 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-3xl font-bold tracking-tight">{counts[key] ?? 0}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">
                  {t('admin-page.overview-open')}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
