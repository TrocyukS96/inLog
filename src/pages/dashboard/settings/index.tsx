import { Outlet } from "react-router-dom"
import RootPageLayout from "../../../widgets/root-page-layout"
import { useTranslation } from "react-i18next"

interface NavItem {
    label: string
    href?: string
    onClick?: () => void
}

const SettingsPage = () => {
    const { t } = useTranslation()

    const navItems: NavItem[] = [
        {
            label: t('settings-page.profile'),
            href: '/settings/profile',
        },
        {
            label: t('settings-page.organizations-and-projects'),
            href: '/settings/organizations-and-projects',
        },
    ]

    return (
        <RootPageLayout navItems={navItems}>
            <div className="h-full">
                <Outlet />
            </div>
        </RootPageLayout>
    )
}

export default SettingsPage