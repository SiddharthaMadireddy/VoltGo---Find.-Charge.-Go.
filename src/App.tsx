import { AppProvider, useApp } from '@/store/app';
import { ToastStack } from '@/components/ToastStack';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { FindChargersPage } from '@/pages/FindChargersPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { WalletPage } from '@/pages/WalletPage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { PricingPage } from '@/pages/PricingPage';
import { ConnectorsPage } from '@/pages/ConnectorsPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { FAQPage } from '@/pages/FAQPage';
import { MockOAuthPage } from '@/pages/MockOAuthPage';

function Router() {
  const { user, route } = useApp();

  // Auth routes are accessible regardless of login state
  switch (route) {
    case 'login':
      return <AuthPage mode="login" />;
    case 'register':
      return <AuthPage mode="register" />;
    case 'home':
      return <LandingPage />;
    case 'about':
      return <AboutPage />;
    case 'contact':
      return <ContactPage />;
    case 'faq':
      return <FAQPage />;
    case 'pricing':
      return <PricingPage />;
    case 'connectors':
      return <ConnectorsPage />;
    case 'mock-oauth':
      return <MockOAuthPage />;
    default:
      break;
  }

  // App routes require login — redirect to login if not signed in
  if (!user) {
    return <AuthPage mode="login" />;
  }

  switch (route) {
    case 'dashboard':
      return <DashboardPage />;
    case 'find':
      return <FindChargersPage />;
    case 'bookings':
      return <BookingsPage />;
    case 'history':
      return <HistoryPage />;
    case 'wallet':
      return <WalletPage />;
    case 'vehicles':
      return <VehiclesPage />;
    case 'notifications':
      return <NotificationsPage />;
    case 'profile':
      return <ProfilePage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <Router />
      <ToastStack />
    </AppProvider>
  );
}
