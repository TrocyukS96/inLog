import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LangPanel } from '../../../shared/ui/LangPanel'
import { routes } from '../../../shared/lib/routes'

export function SignHeader() {
  const { t } = useTranslation()

  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex-1" />

      <h1 className="text-3xl md:text-4xl font-bold text-white text-center flex-1 tracking-tight">
        {t('laboratory-information-system')}
      </h1>

      <div className="flex items-center gap-5">
        <LangPanel />
        <Link
          to={routes.register()}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {t('registration')}
        </Link>
      </div>
    </header>
  )
}