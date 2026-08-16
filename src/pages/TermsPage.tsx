import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/store/app';

export function TermsPage() {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-ink-50 pb-20 pt-8">
      <div className="mx-auto max-w-3xl px-4">
        <button 
          onClick={() => navigate('register')} 
          className="mb-6 flex items-center gap-2 text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-5 w-5" /> Back
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-ink-900">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated: August 16, 2026</p>

          <div className="prose mt-8 max-w-none text-ink-700">
            <h3>1. Introduction</h3>
            <p>Welcome to VoltGo. By accessing or using our mobile application, website, and EV charging services, you agree to be bound by these Terms and Conditions.</p>

            <h3>2. Account Registration</h3>
            <p>You must create an account to use most features of VoltGo. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

            <h3>3. Use of Services</h3>
            <p>VoltGo provides a platform to locate, reserve, and pay for Electric Vehicle charging stations. You agree to use the charging equipment properly and follow all posted guidelines at the physical charging locations.</p>

            <h3>4. Payments and Billing</h3>
            <p>By adding a payment method to your VoltGo Wallet, you authorize us to charge you for the charging sessions and reservations you make. All fees are non-refundable unless otherwise stated.</p>

            <h3>5. Limitation of Liability</h3>
            <p>VoltGo is not responsible for any damage to your vehicle, loss of data, or other damages arising from your use of our services or third-party charging stations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
