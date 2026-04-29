import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, PlusCircle, Download, Settings } from 'lucide-react'

const TABS = [
  { to: '/',        icon: LayoutDashboard, label: '대시보드' },
  { to: '/journal', icon: BookOpen,        label: '목록'    },
  { to: '/new',     icon: PlusCircle,      label: 'NEW' },
  { to: '/export',  icon: Download,        label: 'DOWNLOAD'},
  { to: '/settings',icon: Settings,        label: '설정'   },
]

export default function MobileTabBar() {
  const { pathname } = useLocation()
  return (
    <nav className="tab-bar">
      {TABS.map(({ to, icon: Icon, label }) => (
        <Link key={to} to={to} className={pathname === to ? 'tab-item active' : 'tab-item'}>
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
