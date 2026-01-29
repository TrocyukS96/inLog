import { Link, useLocation } from "react-router-dom"
import { cn } from "../../shared/lib/utils"

interface NavItem {
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
}

const RootPageLayout = ({ children, navItems }: { children: React.ReactNode, navItems: NavItem[] }) => {

    const location = useLocation()

    const isActive = (href: string) => {
        return location.pathname === href
    }

  return (
    <div className="flex flex-row h-full">
      <nav className="w-1/4 h-[calc(100vh-64px)] p-4 border-r border-gray-200">
        {navItems.map((item) => (
          <Link key={item.label} to={item.href ?? ''} onClick={item.onClick} className={cn("flex items-center gap-2 p-2 rounded-lg w-full transition-all duration-300", isActive(item.href ?? '') && 'bg-accent text-white')} >
            {item.icon && <span className={cn('w-4 h-4')} >{item.icon}</span>}
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="w-3/4 p-4 h-[calc(100vh-80px)] ">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {children}
        </div>
      </div>
    </div>
  )
}

export default RootPageLayout