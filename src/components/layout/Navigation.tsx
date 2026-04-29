import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, PlusCircle, Download, LogOut, Anchor, GitBranch } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

const NAV_ITEMS = [
  { to: '/',        icon: LayoutDashboard, label: '대시보드' },
  { to: '/journal', icon: BookOpen,        label: '소재 목록' },
  { to: '/matrix',  icon: GitBranch,       label: '응대 매트릭스' },
  { to: '/new',     icon: PlusCircle,      label: 'NEW'  },
  { to: '/export',  icon: Download,        label: 'DOWNLOAD' },
]

export default function Navigation() {
  const { pathname } = useLocation()
  const { user, signOut } = useAuthStore()

  return (
    <nav className="nav">
      <div className="nav-brand">
        <Anchor size={20} />
        <span>인턴 일지</span>
      </div>
      <ul className="nav-items">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <li key={to}>
            <Link to={to} className={pathname === to ? 'nav-link active' : 'nav-link'}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="nav-user">
        {user && (
          <>
            <span className="nav-email">{user.email}</span>
            <button onClick={signOut} className="btn-icon" title="로그아웃">
              <LogOut size={16} />
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
