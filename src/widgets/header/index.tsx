import { useTranslation } from 'react-i18next'
import { UserMenu } from './ui/UserMenu'
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from '../../shared/ui/dropdown-menu'
import { Button } from '../../shared/ui/button'

export function Header() {
  const { t } = useTranslation()

  const getPageTitle = () => {
    const pathname = window.location.pathname
    const pathSegments = pathname.split('/')
    const pageTitle = pathSegments[pathSegments.length - 1]

    console.log('pageTitle', pageTitle)

    switch (pageTitle) {
      case 'scheduler':
        case 'tasks':
        case 'statuses':
        case 'roadmap':
        return t('header.scheduler')
      case 'settings':
        return t('header.settings')
      default:
        return t('header.dashboard')
    }
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
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language === 'en' ? 'EN' : 'RU'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{currentLanguage}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>EN</DropdownMenuItem>
        <DropdownMenuItem onClick={() => i18n.changeLanguage('ru')}>RU</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}