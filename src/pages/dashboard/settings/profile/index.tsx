import { useTranslation } from "react-i18next"

const ProfilePage = () => {
    const { t } = useTranslation()

    return (
        <div>{t('settings-page.profile')}</div>
    )
}

export default ProfilePage