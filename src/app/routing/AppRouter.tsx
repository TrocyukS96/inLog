import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routes } from '../../shared/lib/routes'
import LoginPage from '../../pages/auth/login'
import RegisterPage from '../../pages/auth/register'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route path={routes.login()} element={<LoginPage />} />
        <Route path={routes.register()} element={<RegisterPage />} />

        {/* Защищённые страницы (потом добавим ProtectedRoute) */}
        <Route path={routes.dashboard()} element={<div>Dashboard</div>} />
        <Route path={routes.projects.list()} element={<div>Список проектов</div>} />
        <Route path={routes.tasks()} element={<div>Tasks</div>} />

        {/* 404 */}
        <Route path={routes.notFound()} element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  )
}