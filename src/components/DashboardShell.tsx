import { ReactNode, useState } from 'react';
import { useApp, AppRoute } from '@/store/app';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard, MapPin, CalendarClock, History, Wallet, Car,
  Bell, User, Menu, X, LogOut, Search, Zap,
} from 'lucide-react';

const NAV: { label: string; route: AppRoute; icon: typeof LayoutDashboard }[] = [
  { label: 'Dashboard', route: 'dashboard', icon: LayoutDashboard },
  { label: 'Find Chargers', route: 'find', icon: MapPin },
  { label: 'My Bookings', route: 'bookings', icon: CalendarClock },
  { label: 'Charging History', route: 'history', icon: History },
  { label: 'Wallet', route: 'wallet', icon: Wallet },
  { label: 'My Vehicle', route: 'vehicles', icon: Car },
  { label: 'Profile', route: 'profile', icon: User },
  { label: 'Notifications', route: 'notifications', icon: Bell },
];

export function DashboardShell({ children, title }: { children: ReactNode; title?: string }) {
  const { route, navigate, user, logout, notifications } = useApp();
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;
  const greeting = getGreeting();

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <button onClick={() => navigate('home')}><Logo /></button>
        <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-ink-500 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="px-3 py-2 lg:hidden">
        <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
          <div className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${user?.avatarColor} text-sm font-bold text-white`}>
            {user?.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink-900">{user?.name}</p>
            <p className="truncate text-xs text-ink-500">{user?.email}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 no-scrollbar">
        {NAV.map((n) => (
          <button
            key={n.route}
            onClick={() => { navigate(n.route); setOpen(false); }}
            className={`nav-link w-full ${route === n.route ? 'nav-link-active' : ''}`}
          >
            <n.icon className="h-5 w-5 shrink-0" />
            <span className="flex-1 text-left">{n.label}</span>
            {n.route === 'notifications' && unread > 0 && (
              <span className="rounded-full bg-rosex-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unread}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="border-t border-ink-200 p-3">
        <button onClick={logout} className="nav-link w-full text-rosex-600 hover:bg-rose-50 hover:text-rosex-600">
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-ink-200 bg-white lg:block">
        {Sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-card animate-slide-up">
            {Sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-ink-700 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0 flex-1">
              {title ? (
                <h1 className="truncate font-display text-lg font-bold text-ink-900">{title}</h1>
              ) : (
                <p className="truncate text-sm text-ink-500">
                  <span className="font-semibold text-ink-900">{greeting}, {user?.name.split(' ')[0]}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('find')}
              className="hidden items-center gap-2 rounded-xl bg-ink-50 px-3 py-2 text-sm text-ink-500 ring-1 ring-ink-200 hover:bg-ink-100 sm:flex"
            >
              <Search className="h-4 w-4" /> Search stations…
            </button>
            <button
              onClick={() => navigate('notifications')}
              className="relative rounded-xl p-2.5 text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rosex-500 ring-2 ring-white" />
              )}
            </button>
            <button
              onClick={() => navigate('profile')}
              className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${user?.avatarColor} text-sm font-bold text-white ring-2 ring-white`}
            >
              {user?.name.charAt(0)}
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
