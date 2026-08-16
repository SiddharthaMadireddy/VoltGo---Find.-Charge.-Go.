import {
  createContext, useContext, useState, useCallback, useMemo, ReactNode,
} from 'react';
import {
  ChargingStation, WalletTxn, ChargingSession, Vehicle, AppNotification, Booking,
} from '@/data/stations';

export type PublicRoute =
  | 'home' | 'about' | 'contact' | 'faq' | 'pricing' | 'connectors' | 'login' | 'register' | 'terms' | 'privacy';

export type AppRoute =
  | 'dashboard' | 'find' | 'bookings' | 'history' | 'wallet'
  | 'vehicles' | 'profile' | 'notifications';

export type Route = PublicRoute | AppRoute;

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  avatarColor: string;
  walletBalance?: number;
  password?: string;
}

interface Toast { id: number; title: string; body?: string; tone: 'success' | 'info' | 'error'; }

interface AppState {
  user: User | null;
  loginUser: (email: string, password?: string) => Promise<void>;
  loginWithGoogleToken: (token: string) => Promise<void>;
  registerUser: (u: User) => Promise<void>;
  logout: () => void;
  route: Route;
  navigate: (r: Route) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  walletBalance: number;
  walletTxns: WalletTxn[];
  addMoney: (amount: number, method: string) => Promise<void>;
  sessions: ChargingSession[];
  vehicles: Vehicle[];
  addVehicle: (v: Vehicle) => Promise<void>;
  updateVehicle: (v: Vehicle) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;
  bookings: Booking[];
  addBooking: (b: Booking) => Promise<void>;
  cancelBooking: (id: string) => Promise<void>;
  notifications: AppNotification[];
  markAllNotificationsRead: () => Promise<void>;
  toasts: Toast[];
  toast: (title: string, body?: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
  
  // deprecated fallback for authpage before refactor
  login: (u: User) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [route, setRoute] = useState<Route>('home');
  const [favorites, setFavorites] = useState<string[]>(['st-gachibowli', 'st-cyberhub']);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTxns, setWalletTxns] = useState<WalletTxn[]>([]);
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toastMessage = useCallback((title: string, body?: string, tone: Toast['tone'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, body, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const loadUserData = (data: any) => {
    setUser({ ...data.user, walletBalance: data.user.walletBalance });
    setWalletBalance(data.user.walletBalance || 0);
    setWalletTxns(data.walletTxns || []);
    setSessions(data.sessions || []);
    setVehicles(data.vehicles || []);
    setBookings(data.bookings || []);
    setNotifications(data.notifications || []);
  };

  const loginUser = useCallback(async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Login failed.');
      }
      const data = await res.json();
      loadUserData(data);
      setRoute('dashboard');
      setTimeout(() => toastMessage(`Welcome back, ${data.user.name.split(' ')[0]}!`, 'You are now signed in.'), 100);
    } catch (e: any) {
      toastMessage('Error', e.message, 'error');
    }
  }, [toastMessage]);

  const loginWithGoogleToken = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token })
      });
      if (!res.ok) throw new Error('Google Login failed.');
      const data = await res.json();
      loadUserData(data);
      setRoute('dashboard');
      setTimeout(() => toastMessage(`Welcome, ${data.user.name.split(' ')[0]}!`, 'You are signed in via Google.'), 100);
    } catch (e: any) {
      toastMessage('Error', e.message, 'error');
    }
  }, [toastMessage]);

  const registerUser = useCallback(async (u: User) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      });
      if (!res.ok) {
         const err = await res.json();
         throw new Error(err.error || 'Registration failed');
      }
      const data = await res.json();
      loadUserData(data);
      setRoute('dashboard');
      setTimeout(() => toastMessage(`Welcome, ${data.user.name.split(' ')[0]}!`, 'Account created.'), 100);
    } catch (e: any) {
      toastMessage('Error', e.message, 'error');
    }
  }, [toastMessage]);

  const login = useCallback((u: User) => {
    loginUser(u.email);
  }, [loginUser]);

  const logout = useCallback(() => {
    setUser(null);
    setRoute('home');
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  }, []);

  const addMoney = useCallback(async (amount: number, method: string) => {
    if (!user) return;
    try {
      const title = 'Wallet Recharge';
      const subtitle = method;
      const date = new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' });
      const res = await fetch('/api/wallet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, amount, method, title, subtitle, date })
      });
      if (res.ok) {
        const { txn } = await res.json();
        setWalletBalance((b) => b + amount);
        setWalletTxns((t) => [txn, ...t]);
        toastMessage('Money added', `₹${amount} added via ${method}.`, 'success');
      }
    } catch (e) {}
  }, [user, toastMessage]);

  const addVehicle = useCallback(async (v: Vehicle) => {
    if (!user) return;
    try {
      await fetch('/api/vehicles/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, userId: user.id })
      });
      setVehicles((vs) => [v, ...vs]);
      toastMessage('Vehicle added', `${v.name} saved to your garage.`, 'success');
    } catch (e) {}
  }, [user, toastMessage]);

  const updateVehicle = useCallback(async (v: Vehicle) => {
    if (!user) return;
    try {
      await fetch('/api/vehicles/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v)
      });
      setVehicles((vs) => vs.map((x) => (x.id === v.id ? v : x)));
      toastMessage('Vehicle updated', `${v.name} details saved.`, 'success');
    } catch (e) {}
  }, [user, toastMessage]);

  const removeVehicle = useCallback(async (id: string) => {
    if (!user) return;
    try {
      await fetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      setVehicles((vs) => vs.filter((x) => x.id !== id));
      toastMessage('Vehicle removed', 'Vehicle deleted from your garage.', 'info');
    } catch (e) {}
  }, [user, toastMessage]);

  const addBooking = useCallback(async (b: Booking) => {
    if (!user) return;
    try {
      const res = await fetch('/api/bookings/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...b, userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        loadUserData(data);
        toastMessage('Reservation confirmed', `Booking ID ${b.id} · ${b.stationName}`, 'success');
      }
    } catch (e) {}
  }, [user, toastMessage]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        loadUserData(data);
        toastMessage('Booking cancelled', 'Refund processed to wallet.', 'info');
      }
    } catch (e) {}
  }, [user, toastMessage]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!user) return;
    try {
      await fetch('/api/notifications/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    } catch (e) {}
  }, [user]);

  const value = useMemo<AppState>(() => ({
    user, loginUser, loginWithGoogleToken, registerUser, login, logout, route, navigate,
    favorites, toggleFavorite,
    walletBalance, walletTxns, addMoney,
    sessions, vehicles, addVehicle, updateVehicle, removeVehicle,
    bookings, addBooking, cancelBooking, notifications, markAllNotificationsRead,
    toasts, toast: toastMessage, dismissToast,
  }), [
    user, loginUser, loginWithGoogleToken, registerUser, login, logout, route, navigate, favorites, toggleFavorite,
    walletBalance, walletTxns, addMoney, sessions, vehicles, addVehicle, updateVehicle, removeVehicle,
    bookings, addBooking, cancelBooking, notifications, markAllNotificationsRead, toasts, toastMessage, dismissToast
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
