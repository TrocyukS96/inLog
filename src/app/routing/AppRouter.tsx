// src/app/routing/AppRouter.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { routes } from '../../shared/lib/routes'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные страницы */}
        <Route path={routes.login()} element={<div>Login</div>} />
        <Route path={routes.register()} element={<div>Регистрация (добавь потом)</div>} />

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