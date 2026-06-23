import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../shared/ui/dropdown-menu'
import { UserMenu } from './ui/UserMenu'
import { useUpdateUserSettingsMutation } from '../../entities/user/model/userSlice'
import { errorsHandler } from '../../shared/lib/errors-handler'
import type { LanguageType } from '../../shared/types/enums'

export function Header() {
  const { t } = useTranslation()

  const getPageTitle = () => {
    const pathname = window.location.pathname

    if (pathname.includes('scheduler')) {
      return t('scheduler-page.title')
    }
    if (pathname.includes('settings')) {
      return t('settings-page.title')
    }
    if (pathname.includes('admin')) {
      return t('admin-page.admin-panel')
    }
    if (pathname.includes('geo-mechanics')) {
      return t('geo-mechanics-page.geo-mechanics')
    }
    return t('header.dashboard')
   
  }

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <UserMenu />
      </div>
    </header>
  )
}

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const [updateUserSettings] = useUpdateUserSettingsMutation()

  const currentLanguage = i18n.language === 'en' ? 'EN' : 'RU'

  const changeLanguage = async (lang: string) => {
    try {
      await updateUserSettings({ language: lang as LanguageType }).unwrap()
      i18n.changeLanguage(lang)
    } catch (error) {
      errorsHandler(error, t)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{currentLanguage}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className={currentLanguage === 'RU' ? 'bg-accent' : ''} onClick={() => changeLanguage('ru')}>RU</DropdownMenuItem>
        <DropdownMenuItem className={currentLanguage === 'EN' ? 'bg-accent' : ''} onClick={() => changeLanguage('en')}>EN</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}