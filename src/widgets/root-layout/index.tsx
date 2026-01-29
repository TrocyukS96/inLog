import { useCallback, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { toast } from 'sonner'
import { useVerifyTokenMutation } from '../../features/auth/model/authSlice'
import { ACCESS_TOKEN } from '../../shared/config/constants'
import { routes } from '../../shared/lib/routes'
import { Header } from '../header'
import { Sidebar } from '../sidebar'
import { isAuthenticated } from '../../features/auth/model/selectors'
import { useGetMeQuery } from '../../entities/user/model/userSlice'
import { useGetOrganizationsQuery } from '../../entities/organization/model/organizationSlice'
import { useGetProjectsQuery } from '../../entities/project/model/projectSlice'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

export function RootLayout() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const [verifyToken] = useVerifyTokenMutation()

  const fetchVerifyToken = async (token: string) => {
    try {
       await verifyToken({ token }).unwrap()
    } catch (error) {
        toast.error('Ошибка при проверке токена')
        sessionStorage.removeItem(ACCESS_TOKEN)
        navigate(routes.login())
    }
  }

  // RTK Query: получаем текущего пользователя
  const { data: user, isLoading: isUserLoading, error: userError} = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  })

  // // RTK Query: организации
  const { data: organizations, isLoading: isOrgsLoading } = useGetOrganizationsQuery(undefined, {
    skip: !isAuthenticated || !user,
  })

  // // RTK Query: проекты первой организации
  const firstOrgId = organizations?.[0]?.id

  const { data: projects, isLoading: isProjectsLoading } = useGetProjectsQuery(
    { organization: firstOrgId! },
    { skip: !isAuthenticated || !firstOrgId }
  )

  // Проверка авторизации и загрузка данных
  useEffect(() => {
    const token = sessionStorage.getItem(ACCESS_TOKEN)

    if (!token) {
      navigate(routes.login())
      return
    }
    fetchVerifyToken(JSON.parse(token))
    
  }, [navigate])

  // Обновление пользователя и языка
  useEffect(() => {
    if (user) {
      // dispatch(setUser({ user }))
      i18n.changeLanguage(user.settings.language || 'ru')
    }
  }, [user, i18n])

  // Логика редиректа после загрузки данных
  const verifyAndRedirect = useCallback(() => {
    if (isUserLoading || isOrgsLoading || isProjectsLoading) return

    if (userError) {
      toast.error('Ошибка загрузки пользователя')
      navigate(routes.login())
      return
    }

    if (!organizations?.length) {
      navigate(routes.organizations.new())
      return
    }

    if (!projects?.length) {
      navigate(routes.projects.new())
      return
    }

    // Если всё ок — остаёмся на текущей странице
  }, [isUserLoading, isOrgsLoading, isProjectsLoading, userError, organizations, projects, navigate])

  useEffect(() => {
    verifyAndRedirect()
  }, [verifyAndRedirect])

  // Пока идёт загрузка — показываем лоадер
  if (isUserLoading || isOrgsLoading || isProjectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full">
        <Header />

        <main className="flex-1 h-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}