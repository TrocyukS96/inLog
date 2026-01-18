import { ChevronDown, Globe, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useUpdateUserSettingsMutation } from '../../../entities/user/model/userSlice'
import { errorsHandler } from '../../../shared/lib/errors-handler'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu'

type Lang = 'ru' | 'en'

export function AuthLangPanel() {
  const { i18n, t } = useTranslation()

  const [updateUserSettings, { isLoading }] = useUpdateUserSettingsMutation()

  const [open, setOpen] = useState(false)
  const currentLang = i18n.language as Lang

  const changeLanguage = async (lang: Lang) => {
      try {
        const formData = new FormData()
        formData.append('language', lang)
        await updateUserSettings(formData).unwrap()
        i18n.changeLanguage(lang)
        toast.success(t('language-changed'))
      } catch (err) {
        errorsHandler(err, t)
      } finally {
        setOpen(false)
      }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{currentLang.toUpperCase()}</span>

        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => changeLanguage('ru')}
          disabled={isLoading}
          className={currentLang === 'ru' ? 'bg-accent' : ''}
        >
          Русский
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => changeLanguage('en')}
          disabled={isLoading}
          className={currentLang === 'en' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}