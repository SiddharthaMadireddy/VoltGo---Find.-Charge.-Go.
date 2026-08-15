import { useEffect, useState } from 'react';

export function MockOAuthPage() {
  const [provider, setProvider] = useState<'google' | 'apple'>('google');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('provider') === 'apple') {
      setProvider('apple');
      setEmail('apple@voltgo.app');
    } else {
      setProvider('google');
      setEmail('google@voltgo.app');
    }
  }, []);

  const handleLogin = () => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'MOCK_OAUTH_SUCCESS', provider, email },
        window.location.origin
      );
      window.close();
    }
  };

  if (provider === 'google') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white font-sans">
        <div className="w-full max-w-[450px] rounded-lg border border-gray-200 px-10 py-12 text-center shadow-sm">
          <GoogleLogo />
          <h1 className="mt-4 text-2xl font-normal text-gray-800">Sign in</h1>
          <p className="mt-2 text-base text-gray-600">Continue to VoltGo</p>
          <div className="mt-10 text-left">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Email or phone"
            />
            <p className="mt-2 text-sm font-medium text-blue-600 hover:underline cursor-pointer">Forgot email?</p>
          </div>
          <div className="mt-12 flex items-center justify-between">
            <p className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">Create account</p>
            <button
              onClick={handleLogin}
              className="rounded bg-[#1a73e8] px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#fbfbfd] font-sans pt-20">
      <AppleLogo />
      <h1 className="mt-6 text-2xl font-semibold text-[#1d1d1f]">Sign in with your Apple ID</h1>
      <div className="mt-10 w-full max-w-[400px]">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base focus:border-[#0071e3] focus:outline-none focus:ring-1 focus:ring-[#0071e3]"
            placeholder="Apple ID"
          />
          <button
            onClick={handleLogin}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100 text-gray-500"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </button>
        </div>
        <div className="mt-8 text-center text-sm text-[#0071e3] hover:underline cursor-pointer">
          Forgotten your Apple ID or password?
        </div>
      </div>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg className="mx-auto h-8 w-auto" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
function AppleLogo() {
  return (
    <svg className="mx-auto h-10 w-auto fill-[#1d1d1f]" viewBox="0 0 24 24">
      <path d="M17.05 12.04c-.03-2.7 2.2-3.99 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.66-.17-3.24.98-4.08.98-.85 0-2.15-.96-3.54-.93-1.82.03-3.5 1.06-4.43 2.69-1.9 3.29-.49 8.16 1.36 10.83.9 1.31 1.97 2.78 3.37 2.73 1.36-.06 1.87-.88 3.51-.88 1.63 0 2.1.88 3.54.85 1.46-.03 2.39-1.34 3.28-2.66 1.04-1.52 1.47-2.99 1.49-3.07-.03-.01-2.85-1.09-2.88-4.34zM14.25 4.69c.75-.91 1.26-2.17 1.12-3.43-1.08.04-2.4.72-3.18 1.62-.7.8-1.31 2.09-1.15 3.32 1.21.1 2.45-.61 3.21-1.51z" />
    </svg>
  );
}
