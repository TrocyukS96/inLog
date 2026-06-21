import { useTranslation } from "react-i18next"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../shared/ui/tabs"
import NotificationsSettings from "../../../features/notifications/notifications-settings/ui/NotificationsSettings"

const NotificationsPage = () => {
    const { t } = useTranslation()

    return (
        <div className="pl-2">
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">
                        {t('notifications-page.all-notifications')}
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        {t('notifications-page.settings')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <div>
                        <h2 className="text-lg font-medium">{t('notifications-page.all-notifications')}</h2>
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <NotificationsSettings />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default NotificationsPage
