import { useState } from 'react';
import { useApp } from '@/store/app';
import { DashboardShell } from '@/components/DashboardShell';
import { STATIONS } from '@/data/stations';
import {
  User, Mail, Phone, Pencil, Lock, Bell, CreditCard, Heart, Shield,
  Trash2, LogOut, Check, X, ChevronRight, MapPin, Star,
} from 'lucide-react';

export function ProfilePage() {
  const { user, logout, navigate, favorites, toast, sessions } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  if (!user) return null;
  const favStations = STATIONS.filter((s) => favorites.includes(s.id));

  const settings = [
    { icon: Pencil, label: 'Edit Profile', action: () => setEditing(true) },
    { icon: Lock, label: 'Change Password', action: () => toast('Change password', 'A reset link has been sent to your email.', 'info') },
    { icon: Bell, label: 'Notification Preferences', action: () => toast('Notification preferences', 'Manage your push and email alerts.', 'info') },
    { icon: CreditCard, label: 'Payment Methods', action: () => navigate('wallet') },
    { icon: Heart, label: 'Saved Stations', action: () => toast('Saved stations', `${favStations.length} stations saved.`, 'info') },
    { icon: Shield, label: 'Privacy Settings', action: () => toast('Privacy settings', 'Manage your data and privacy preferences.', 'info') },
  ];

  return (
    <DashboardShell title="Profile & Settings">
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <div className="card-pad text-center">
            <div className={`mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br ${user.avatarColor} text-3xl font-bold text-white shadow-glow`}>
              {user.name.charAt(0)}
            </div>
            <h2 className="mt-4 font-display text-xl font-extrabold text-ink-900">{user.name}</h2>
            <p className="mt-1 text-sm text-ink-500">VoltGo Member since 2024</p>
            <div className="mt-4 flex justify-center gap-4 text-center">
              <div>
                <p className="font-display text-lg font-bold text-ink-900">{sessions ? sessions.length : 0}</p>
                <p className="text-[11px] text-ink-400">Sessions</p>
              </div>
              <div className="w-px bg-ink-200" />
              <div>
                <p className="font-display text-lg font-bold text-ink-900">{favorites ? favorites.length : 0}</p>
                <p className="text-[11px] text-ink-400">Saved</p>
              </div>
              <div className="w-px bg-ink-200" />
              <div>
                <p className="font-display text-lg font-bold text-ink-900">{sessions && sessions.length > 0 ? '4.7★' : '0.0★'}</p>
                <p className="text-[11px] text-ink-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="card-pad mt-4">
            <h3 className="font-display text-sm font-bold text-ink-900">Contact</h3>
            <div className="mt-3 space-y-3">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone} />
              <InfoRow icon={<User className="h-4 w-4" />} label="Name" value={user.name} />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2">
          <div className="card-pad">
            <h3 className="font-display text-lg font-bold text-ink-900">Settings</h3>
            <div className="mt-4 divide-y divide-ink-100">
              {settings.map((s) => (
                <button
                  key={s.label}
                  onClick={s.action}
                  className="flex w-full items-center gap-3 py-3.5 text-left transition hover:bg-ink-50"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-100 text-ink-600">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink-900">{s.label}</span>
                  <ChevronRight className="h-5 w-5 text-ink-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Saved stations */}
          {favStations.length > 0 && (
            <div className="card-pad mt-4">
              <h3 className="font-display text-lg font-bold text-ink-900">Saved Stations</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {favStations.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate('find')}
                    className="flex items-center gap-3 rounded-xl border border-ink-200 p-3 text-left transition hover:bg-ink-50"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-volt-50 text-volt-600">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{s.name}</p>
                      <p className="text-xs text-ink-500">{s.area} · {s.distanceKm} km</p>
                    </div>
                    <span className="chip-base px-2 py-1 text-[11px]">
                      <Star className="h-3 w-3 fill-amberx-500 text-amberx-500" />{s.rating}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Danger zone */}
          <div className="card-pad mt-4 border-rosex-200">
            <h3 className="font-display text-sm font-bold text-rosex-600">Danger Zone</h3>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => toast('Account deletion', 'Contact support to delete your account.', 'info')}
                className="btn btn-sm flex-1 bg-rose-50 text-rosex-600 hover:bg-rose-100"
              >
                <Trash2 className="h-4 w-4" /> Delete Account
              </button>
              <button onClick={logout} className="btn btn-sm flex-1 bg-ink-900 text-white hover:bg-ink-800">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <EditModal
          name={name} email={email} phone={phone}
          onName={setName} onEmail={setEmail} onPhone={setPhone}
          onClose={() => setEditing(false)}
          onSave={() => {
            toast('Profile updated', 'Your details have been saved.', 'success');
            setEditing(false);
          }}
        />
      )}
    </DashboardShell>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-100 text-ink-600">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-ink-400">{label}</p>
        <p className="truncate text-sm font-semibold text-ink-900">{value}</p>
      </div>
    </div>
  );
}

function EditModal({
  name, email, phone, onName, onEmail, onPhone, onClose, onSave,
}: {
  name: string; email: string; phone: string;
  onName: (v: string) => void; onEmail: (v: string) => void; onPhone: (v: string) => void;
  onClose: () => void; onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-map animate-slide-up sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-ink-200 p-5">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Edit Profile</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={name} onChange={(e) => onName(e.target.value)} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => onEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={phone} onChange={(e) => onPhone(e.target.value)} />
          </div>
          <div className="flex gap-2.5 pt-2">
            <button onClick={onSave} className="btn-primary flex-1"><Check className="h-4 w-4" /> Save Changes</button>
            <button onClick={onClose} className="btn-ghost">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
