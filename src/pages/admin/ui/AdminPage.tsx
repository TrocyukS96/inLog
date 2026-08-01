import {
  Building2,
  CheckSquare,
  FolderKanban,
  PieChart,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react'
import { routes } from "../../../shared/lib/routes"
import { useTranslation } from "react-i18next"
import RootPageLayout from "../../../widgets/root-page-layout"
import { Outlet } from "react-router-dom"

interface NavItem {
    label: string
    href?: string
    icon?: React.ReactNode
    onClick?: () => void
}

const AdminPage = () => {

    const { t } = useTranslation()

    const navItems: NavItem[] = [
        {
            label: t('admin-page.users'),
            href: routes.admin.users(),
            icon: <Users className="h-4 w-4" />,
        },
        {
            label: t('admin-page.members'),
            href: routes.admin.members(),
            icon: <UserCheck className="h-4 w-4" />,
        },
        {
            label: t('admin-page.organizations'),
            href: routes.admin.organizations(),
            icon: <Building2 className="h-4 w-4" />,
        },
        {
            label: t('admin-page.projects'),
            href: routes.admin.projects(),
            icon: <FolderKanban className="h-4 w-4" />,
        },
        {
            label: t('admin-page.tasks'),
            href: routes.admin.tasks(),
            icon: <CheckSquare className="h-4 w-4" />,
        },
        {
            label: t('admin-page.constructor'),
            href: routes.admin.constructor(),
            icon: <Wrench className="h-4 w-4" />,
        },
        {
            label: t('admin-page.reports'),
            href: routes.admin.reports(),
            icon: <PieChart className="h-4 w-4" />,
        },
    ]


    return (
        <RootPageLayout navItems={navItems}>
            <div className="h-full w-full">
                <div className="pl-2 min-w-0">
                    <Outlet />
                </div>
            </div>
        </RootPageLayout>
    )
}

export default AdminPage
