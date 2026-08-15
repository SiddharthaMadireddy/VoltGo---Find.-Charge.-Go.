import { ReactNode } from 'react';
import { useApp } from '@/store/app';
import { Logo } from '@/components/Logo';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { Route } from '@/store/app';

const NAV: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' },
  { label: 'Find Chargers', route: 'find' },
  { label: 'Pricing', route: 'pricing' },
  { label: 'Connectors', route: 'connectors' },
  { label: 'About', route: 'about' },
  { label: 'FAQ', route: 'faq' },
];

export function PublicShell({ children }: { children: ReactNode }) {
  const { route, navigate } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <button onClick={() => navigate('home')} className="flex items-center">
            <Logo />
          </button>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <button
                key={n.route}
                onClick={() => navigate(n.route)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  route === n.route ? 'bg-volt-50 text-volt-700' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <button onClick={() => navigate('login')} className="btn-ghost btn-sm">Login</button>
            <button onClick={() => navigate('register')} className="btn-primary btn-sm">
              <Zap className="h-4 w-4" /> Get Started
            </button>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-2 text-ink-700 lg:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-ink-200/70 bg-white px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <button
                  key={n.route}
                  onClick={() => { navigate(n.route); setOpen(false); }}
                  className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                    route === n.route ? 'bg-volt-50 text-volt-700' : 'text-ink-700 hover:bg-ink-100'
                  }`}
                >
                  {n.label}
                </button>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button onClick={() => { navigate('login'); setOpen(false); }} className="btn-ghost btn-sm">Login</button>
                <button onClick={() => { navigate('register'); setOpen(false); }} className="btn-primary btn-sm">Get Started</button>
              </div>
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}

export function PublicFooter() {
  const { navigate } = useApp();
  return (
    <footer className="border-t border-ink-200/70 bg-white">
      <div className="container-x py-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-500">
              Making EV charging simple, accessible and reliable. Find available chargers near you, reserve in seconds, and pay securely.
            </p>
            <div className="mt-5 flex gap-2">
              {['X', 'in', 'f', 'ig', 'yt'].map((s) => (
                <span key={s} className="grid h-9 w-9 place-items-center rounded-xl bg-ink-100 text-xs font-bold text-ink-600 transition hover:bg-volt-50 hover:text-volt-600 cursor-pointer">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <FooterCol title="Quick Links" links={[
            { label: 'Home', route: 'home' }, { label: 'Find Chargers', route: 'find' },
            { label: 'About', route: 'about' }, { label: 'Contact', route: 'contact' }, { label: 'FAQ', route: 'faq' },
          ]} navigate={navigate} />
          <FooterCol title="User" links={[
            { label: 'Dashboard', route: 'login' }, { label: 'Bookings', route: 'login' },
            { label: 'Wallet', route: 'login' }, { label: 'Charging History', route: 'login' },
          ]} navigate={navigate} />
          <div>
            <h4 className="text-sm font-bold text-ink-900">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
              <li><button className="hover:text-volt-600">Privacy Policy</button></li>
              <li><button className="hover:text-volt-600">Terms & Conditions</button></li>
              <li><button className="hover:text-volt-600">Refund Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-200/70 pt-6 text-xs text-ink-400 sm:flex-row">
          <p>© 2026 VoltGo Mobility Pvt. Ltd. All rights reserved.</p>
          <p>Made in India · Powering the electric revolution</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links, navigate }: {
  title: string;
  links: { label: string; route: Route }[];
  navigate: (r: Route) => void;
}) {
  return (
    <div>
      <h4 className="text-sm font-bold text-ink-900">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
        {links.map((l) => (
          <li key={l.label}>
            <button onClick={() => navigate(l.route)} className="hover:text-volt-600">{l.label}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
