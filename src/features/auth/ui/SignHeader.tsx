import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthLangPanel } from './AuthLangPanel'
import { routes } from '../../../shared/lib/routes'
import { useLocation } from 'react-router-dom'

export function SignHeader() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <header className="grid grid-cols-3 justify-between px-6 py-4">
      <div />

      <h1 className="text-3xl md:text-4xl font-bold text-white text-center flex-1 tracking-tight">
        {t('auth.laboratory-information-system')}
      </h1>

      <div className=" flex items-center gap-5 justify-end">
        <AuthLangPanel />
        <Link
          to={pathname === routes.register() ? routes.login() : routes.register()}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          { pathname === routes.register() ? t('auth.login') : t('auth.registration')}
        </Link>
      </div>
    </header>
  )
}