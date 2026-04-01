import { routes } from "../../../shared/lib/routes"
import { useTranslation } from "react-i18next"
import RootPageLayout from "../../../widgets/root-page-layout"
import { Outlet } from "react-router-dom"

interface NavItem {
    label: string
    href?: string
    onClick?: () => void
}

const AdminPage = () => {

    const { t } = useTranslation()

    const navItems: NavItem[] = [
        {
            label: t('admin-page.constructor'),
            href: routes.admin.constructor(),
        },
        {
            label: t('admin-page.reports'),
            href: routes.admin.reports(),
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