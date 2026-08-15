import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import {
  Bell, CalendarClock, Zap, Wallet, CreditCard, MapPin, Clock, CheckCheck, X,
} from 'lucide-react';
import { AppNotification } from '@/data/stations';

const TYPE_META: Record<AppNotification['type'], { icon: typeof Bell; color: string }> = {
  booking: { icon: CalendarClock, color: 'bg-volt-50 text-volt-600' },
  charging: { icon: Zap, color: 'bg-spark-50 text-spark-600' },
  wallet: { icon: Wallet, color: 'bg-amber-50 text-amberx-600' },
  reminder: { icon: Clock, color: 'bg-spark-50 text-spark-600' },
  availability: { icon: MapPin, color: 'bg-volt-50 text-volt-600' },
  payment: { icon: CreditCard, color: 'bg-rose-50 text-rosex-600' },
};

export function NotificationsPage() {
  const { notifications, markAllNotificationsRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DashboardShell title="Notifications">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{unread} unread of {notifications.length}</p>
        {unread > 0 && (
          <button onClick={markAllNotificationsRead} className="btn-ghost btn-sm">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {notifications.map((n) => {
          const meta = TYPE_META[n.type];
          return (
            <div
              key={n.id}
              className={`card flex items-start gap-3 p-4 ${n.read ? '' : 'ring-2 ring-volt-200'}`}
            >
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${meta.color}`}>
                <meta.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-ink-900">{n.title}</p>
                  {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-volt-500" />}
                </div>
                <p className="mt-0.5 text-sm text-ink-500">{n.body}</p>
                <p className="mt-1.5 text-[11px] text-ink-400">{n.date}</p>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="card-pad py-12 text-center">
            <Bell className="mx-auto h-10 w-10 text-ink-300" />
            <p className="mt-3 text-sm text-ink-500">No notifications yet.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
