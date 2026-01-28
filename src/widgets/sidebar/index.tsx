import {
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { routes } from '../../shared/lib/routes'
import { cn } from '../../shared/lib/utils'
import { Button } from '../../shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../shared/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../shared/ui/tooltip'

export function Sidebar() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      sessionStorage.clear()
      toast.success(t('notice-list.log-out-success'))
      navigate(routes.login())
    } catch {
      toast.error(t('errors.error-logout'))
    }
  }

  return (
    <TooltipProvider>
      <aside className="w-16 bg-background border-r border-border flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="p-4 border-b border-border flex justify-center">
          <h1 className="text-xl font-bold text-primary">IL</h1>
        </div>

        <nav className="flex-1 flex flex-col items-center py-6 space-y-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={routes.dashboard()}
                className={({ isActive }) =>
                  cn(
                    "p-2 h-7 w-7 flex items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <LayoutDashboard className="h-5 w-5" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">{t('sidebar.dashboard')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={routes.scheduler.list()}
                className={({ isActive }) =>
                  cn(
                    "p-2 h-7 w-7 flex items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <FolderKanban className="h-5 w-5" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">{t('sidebar.scheduler')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={routes.settings()}
                className={({ isActive }) =>
                  cn(
                    "p-2 h-7 w-7 flex items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <Settings className="h-5 w-5" />
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">{t('sidebar.settings')}</TooltipContent>
          </Tooltip>
        </nav>

        <div className="p-4 border-t border-border flex flex-col items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer p-2 h-7 w-7 flex items-center justify-center rounded-lg">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="h-4 w-4 mr-2" />
                {t('sidebar.light-mode')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="h-4 w-4 mr-2" />
                {t('sidebar.dark-mode')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="h-4 w-4 mr-2" />
                {t('sidebar.system-mode')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer p-2 h-7 w-7 flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t('sidebar.log-out')}</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}