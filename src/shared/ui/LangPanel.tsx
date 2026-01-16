import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../entities/user/model/selectors'
import { useUpdateUserSettingsMutation } from '../../entities/user/model/userSlice'

type Lang = 'ru' | 'en'

interface LangPanelProps {
  signMode?: boolean
}

export function LangPanel({ signMode = false }: LangPanelProps) {
  const { i18n } = useTranslation()
  const user = useSelector(selectUser)
  const [updateUserSettings, { isLoading }] = useUpdateUserSettingsMutation()

  const [open, setOpen] = useState(false)
  const currentLang = i18n.language as Lang

  const changeLanguage = async (lang: Lang) => {
    if (!signMode && user) {
      try {
        // если есть эндпоинт на обновление языка пользователя
        // await dispatch(
        //   userApi.endpoints.updateUserSettings.initiate({ language: lang })
        // ).unwrap()
        await updateUserSettings({ language: lang }).unwrap()
      } catch (err) {
        console.error('Не удалось обновить язык на сервере', err)
      }
    }

    i18n.changeLanguage(lang)
    setOpen(false)
  }

  useEffect(() => {
    if (!signMode && user?.settings?.language) {
      i18n.changeLanguage(user.settings.language)
    }
  }, [user, signMode])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white hover:bg-white/10 transition-colors">
        <Globe className="h-4 w-4" />
        <span className="font-medium">{currentLang.toUpperCase()}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem onClick={() => changeLanguage('ru')}>
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}