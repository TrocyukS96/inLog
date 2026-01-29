import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { LogOut, Settings, User, UserIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../shared/ui/dropdown-menu'
import { useLogoutMutation } from '../../../features/auth/model/authSlice'
import { routes } from '../../../shared/lib/routes'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { selectUser } from '../../../entities/user/model/selectors'

export function UserMenu() {
  const { t } = useTranslation()
  const user = useSelector(selectUser)
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      sessionStorage.clear()
      toast.success(t('notice-list.log-out-success'))
      window.location.href = routes.login()
    } catch {
      toast.error(t('errors.error-logout'))
    }
  }

  // const initials = user
  //   ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  //   : '??'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        {/* <Avatar className="h-10 w-10 cursor-pointer">
          <AvatarImage src={user?.avatar?.medium} alt={user?.fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar> */}
        <UserIcon className="h-6 w-6 cursor-pointer" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {user?.fullName || user?.email || t('header.user-menu')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={routes.settings.profile()} className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('header.profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={routes.settings.list()} className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t('header.settings')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          {t('header.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}