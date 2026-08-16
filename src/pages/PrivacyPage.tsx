import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/store/app';

export function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-ink-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-500">Last updated: August 16, 2026</p>

          <div className="prose mt-8 max-w-none text-ink-700">
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, and payment method.</p>

            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services. This includes using the information to process transactions, send related information, provide customer support, and send administrative messages.</p>

            <h3>3. Sharing of Information</h3>
            <p>We may share the information we collect about you with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf, such as payment processors and cloud hosting providers.</p>

            <h3>4. Security</h3>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

            <h3>5. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at support.voltgo07@gmail.com.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
