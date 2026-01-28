import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { routes } from '../../shared/lib/routes'
import LoginPage from '../../pages/auth/login'
import RegisterPage from '../../pages/auth/register'
import CheckEmailPage from '../../pages/auth/check-email'
import PasswordRecoveryPage from '../../pages/auth/password-recovery'
import RecoveryMessagePage from '../../pages/auth/recovery-message'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
            <Route index element={<div>Dashboard</div>} />
            <Route path={routes.scheduler.list()} element={<div>Scheduler</div>} >
              <Route index path={routes.scheduler.tasks()} element={<div>Tasks</div>} />
              <Route path={routes.scheduler.statuses()} element={<div>Statuses</div>} />
              <Route path={routes.scheduler.roadmap()} element={<div>Roadmap</div>} />
            </Route>
            <Route path={routes.settings()} element={<div>Settings</div>} />

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