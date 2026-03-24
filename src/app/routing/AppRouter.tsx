import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import AdminPage from '../../pages/admin'
import { AdminConstructorPage } from '../../pages/admin/admin-constructor'
import CheckEmailPage from '../../pages/auth/check-email'
import LoginPage from '../../pages/auth/login'
import PasswordRecoveryPage from '../../pages/auth/password-recovery'
import RecoveryMessagePage from '../../pages/auth/recovery-message'
import RegisterPage from '../../pages/auth/register'
import DashboardPage from '../../pages/dashboard'
import GeoMechanicsPage from '../../pages/dashboard/geo-mechanics'
import SchedulerPage from '../../pages/dashboard/scheduler'
import TasksPage from '../../pages/dashboard/scheduler/tasks'
import TemplatesPage from '../../pages/dashboard/scheduler/templates'
import SettingsPage from '../../pages/dashboard/settings'
import OrganizationsAndProjectsPage from '../../pages/dashboard/settings/ogranizations-and-projects'
import ProfilePage from '../../pages/dashboard/settings/profile'
import { routes } from '../../shared/lib/routes'
import { RootLayout } from '../../widgets/root-layout'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route path={routes.login()} element={<LoginPage />} />
        <Route path={routes.register()} element={<RegisterPage />} />
        <Route path={routes.checkEmail()} element={<CheckEmailPage />} />
        <Route path={routes.passwordRecovery()} element={<PasswordRecoveryPage />} />
        <Route path={routes.recoveryMessage()} element={<RecoveryMessagePage />} />


        <Route element={<ProtectedRoute />}>
          <Route path={routes.dashboard()} element={<RootLayout />} >
            <Route index element={<DashboardPage />} />
            <Route path={routes.scheduler.list()} element={<SchedulerPage />} >
              <Route index element={<Navigate to={routes.scheduler.tasks()} replace />} />
              <Route path={routes.scheduler.tasks()} element={<TasksPage />} />
              <Route path={routes.scheduler.templates()} element={<TemplatesPage />} />
              <Route path={routes.scheduler.statuses()} element={<div>Statuses</div>} />
              <Route path={routes.scheduler.roadmap()} element={<div>Roadmap</div>} />
            </Route>
            <Route path={routes.admin.list()} element={<AdminPage />} >
              {/* <Route index element={<Navigate to={routes.admin.settings()} replace />} /> */}
              <Route index element={<Navigate to={routes.admin.constructor()} replace />} />
              <Route path={routes.admin.constructor()} element={<AdminConstructorPage />} />
            </Route>
            <Route path={routes.settings.list()} element={<SettingsPage />}  >
              <Route index element={<Navigate to={routes.settings.profile()} replace />} />
              <Route path={routes.settings.profile()} element={<ProfilePage />} />
              <Route path={routes.settings.organizationsAndProjects()} element={<OrganizationsAndProjectsPage />} />
            </Route>
            <Route path={routes.geoMechanics.list()} element={<GeoMechanicsPage />} />
          </Route>
        </Route>

        <Route path={routes.notFound()} element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  )
}

const ProtectedRoute = () => {
  // const isAuth = useSelector(selectIsAuthenticated)
  const isAuth = true
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) navigate(routes.login())
  }, [isAuth])

  return isAuth ? <Outlet /> : null
}