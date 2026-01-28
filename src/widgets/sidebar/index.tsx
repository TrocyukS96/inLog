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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../shared/ui/accordion'
import { Button } from '../../shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../shared/ui/dropdown-menu'

export function Sidebar() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // await logout().unwrap()
      sessionStorage.clear()
      toast.success(t('notice-list.log-out-success'))
      navigate(routes.login())
    } catch {
      toast.error(t('errors.error-logout'))
    }
  }

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">InLog</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink
          to={routes.dashboard()}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          {t('sidebar.dashboard')}
        </NavLink>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="scheduler" className="border-none">
            <AccordionTrigger className={cn(
              "p-3 rounded-lg transition-colors w-full flex justify-start gap-3",
              location.pathname.includes('/scheduler')
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}>
              <FolderKanban className="h-5 w-5" />
              {t('sidebar.scheduler')}
            </AccordionTrigger>

            <AccordionContent className=" pb-0 pt-2 flex flex-col items-center space-y-2">
              <NavLink
                to={routes.scheduler.tasks()}
                className={({ isActive }) =>
                  cn(
                    " p-2 px-6 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {t('sidebar.tasks')}
              </NavLink>

              <NavLink
                to={routes.scheduler.statuses()}
                className={({ isActive }) =>
                  cn(
                    "p-2 px-6 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {t('sidebar.statuses')}
              </NavLink>

              <NavLink
                to={routes.scheduler.roadmap()}
                className={({ isActive }) =>
                  cn(
                    "p-2 px-6 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                {t('sidebar.roadmap')}
              </NavLink>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <NavLink
          to={routes.settings()}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <Settings className="h-5 w-5" />
          {t('sidebar.settings')}
        </NavLink>

      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-3">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5" />
              ) : theme === 'light' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Monitor className="h-5 w-5" />
              )}
              {theme === 'dark'
                ? t('sidebar.dark-mode')
                : theme === 'light'
                  ? t('sidebar.light-mode')
                  : t('sidebar.system-mode')}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
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

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {t('sidebar.log-out')}
        </Button>
      </div>
    </aside>
  )
}