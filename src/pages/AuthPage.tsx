import { useState } from 'react';
import { useApp } from '@/store/app';
import { Logo } from '@/components/Logo';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, Car, ShieldCheck,
  Zap, CheckCircle2, Star,
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

const HERO_IMG = 'https://images.pexels.com/photos/9799743/pexels-photo-9799743.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900';

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { loginUser, registerUser, loginWithGoogleToken, navigate } = useApp();
  const [show, setShow] = useState(false);
  const isLogin = mode === 'login';

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      loginWithGoogleToken(tokenResponse.access_token);
    },
    onError: () => {
      console.error('Google Login Failed');
    },
  });

  const handleOAuth = (providerName: string, providerId: 'google' | 'apple') => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      `/?mock_oauth=true&provider=${providerId}`,
      'OAuth Login',
      `width=${width},height=${height},top=${top},left=${left},toolbar=no,menubar=no,scrollbars=no`
    );

    const onMessage = async (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'MOCK_OAUTH_SUCCESS') {
        window.removeEventListener('message', onMessage);
        const email = e.data.email;
        const name = providerName;
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          if (res.ok) {
            loginUser(email);
          } else {
            registerUser({ name, email, phone: '', avatarColor: 'from-volt-400 to-spark-500' });
          }
        } catch (err) {}
      }
    };

    window.addEventListener('message', onMessage);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left form */}
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <button onClick={() => navigate('home')} className="flex">
          <Logo />
        </button>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl font-extrabold text-ink-900">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {isLogin
              ? 'Sign in to manage your chargers, wallet and bookings.'
              : 'Join VoltGo and start charging across India in minutes.'}
          </p>

          {isLogin ? <LoginForm show={show} setShow={setShow} /> : <RegisterForm show={show} setShow={setShow} />}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200" />
            <span className="text-xs font-semibold text-ink-400">OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-ink-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleGoogleLogin()}
              className="btn-ghost"
            >
              <GoogleIcon /> Google
            </button>
            <button
              onClick={() => handleOAuth('Apple User', 'apple')}
              className="btn-ghost"
            >
              <AppleIcon /> Apple
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-ink-500">
            {isLogin ? (
              <>Don't have an account?{' '}
                <button onClick={() => navigate('register')} className="font-semibold text-volt-600 hover:underline">Create one</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => navigate('login')} className="font-semibold text-volt-600 hover:underline">Login</button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right visual */}
      <div className="relative hidden lg:block">
        <img src={HERO_IMG} alt="EV charging" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/40 to-ink-900/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-2 text-volt-300">
            <Zap className="h-5 w-5 fill-volt-400 text-volt-400" />
            <span className="text-sm font-bold uppercase tracking-wider">VoltGo Network</span>
          </div>
          <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight text-balance">
            8,000+ chargers. 50+ cities. One app.
          </h2>
          <p className="mt-3 max-w-md text-white/80">
            Join the largest smart EV charging network in India. Real-time availability, transparent pricing and secure wallet payments.
          </p>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="font-display text-3xl font-bold">2,500+</p>
              <p className="text-sm text-white/70">Stations</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold">99%</p>
              <p className="text-sm text-white/70">Uptime</p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold">4.7★</p>
              <p className="text-sm text-white/70">User rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) {
  const { loginUser, navigate } = useApp();
  return (
    <form
      className="mt-7 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const emailOrPhone = data.get('emailOrPhone') as string || 'Guest';
        loginUser(emailOrPhone);
      }}
    >
      <div>
        <label className="label">Email or Phone Number</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input name="emailOrPhone" className="input pl-11" type="text" placeholder="you@example.com" required />
        </div>
      </div>
      <div>
        <label className="label">Password</label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input name="password" className="input pl-11 pr-11" type={show ? 'text' : 'password'} placeholder="••••••••" required />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-ink-600">
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-ink-300 text-volt-500 focus:ring-volt-500" />
          Remember me
        </label>
        <button type="button" className="font-semibold text-volt-600 hover:underline">Forgot password?</button>
      </div>
      <button type="submit" className="btn-primary w-full text-base">
        Login <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function RegisterForm({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) {
  const { registerUser } = useApp();
  return (
    <form
      className="mt-7 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = data.get('name') as string || 'User';
        const email = data.get('email') as string || '';
        const phone = data.get('phone') as string || '';
        registerUser({ name, email, phone, avatarColor: 'from-volt-400 to-spark-500' });
      }}
    >
      <div>
        <label className="label">Full Name</label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
          <input name="name" className="input pl-11" placeholder="Your Name" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input name="email" className="input pl-11" type="email" placeholder="you@example.com" required />
          </div>
        </div>
        <div>
          <label className="label">Phone Number</label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input name="phone" className="input pl-11" placeholder="+91 98765 43210" required />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input name="password" className="input pl-11 pr-11" type={show ? 'text' : 'password'} placeholder="••••••••" required minLength={6} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="label">Confirm Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
            <input name="confirmPassword" className="input pl-11" type="password" placeholder="••••••••" required minLength={6} />
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-ink-50 p-4 ring-1 ring-ink-200">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <Car className="h-4 w-4" /> Vehicle Details (optional)
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input className="input" placeholder="Vehicle Type" />
          <input className="input" placeholder="Vehicle Model" />
          <input className="input" placeholder="Registration No." />
        </div>
      </div>
      <label className="flex items-start gap-2 text-sm text-ink-600">
        <input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 rounded border-ink-300 text-volt-500 focus:ring-volt-500" />
        I agree to the <button type="button" className="font-semibold text-volt-600 hover:underline">Terms & Conditions</button> and <button type="button" className="font-semibold text-volt-600 hover:underline">Privacy Policy</button>
      </label>
      <button type="submit" className="btn-primary w-full text-base">
        Create Account <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5 fill-ink-900" viewBox="0 0 24 24">
      <path d="M17.05 12.04c-.03-2.7 2.2-3.99 2.3-4.06-1.25-1.83-3.2-2.08-3.9-2.11-1.66-.17-3.24.98-4.08.98-.85 0-2.15-.96-3.54-.93-1.82.03-3.5 1.06-4.43 2.69-1.9 3.29-.49 8.16 1.36 10.83.9 1.31 1.97 2.78 3.37 2.73 1.36-.06 1.87-.88 3.51-.88 1.63 0 2.1.88 3.54.85 1.46-.03 2.39-1.34 3.28-2.66 1.04-1.52 1.47-2.99 1.49-3.07-.03-.01-2.85-1.09-2.88-4.34zM14.25 4.69c.75-.91 1.26-2.17 1.12-3.43-1.08.04-2.4.72-3.18 1.62-.7.8-1.31 2.09-1.15 3.32 1.21.1 2.45-.61 3.21-1.51z" />
    </svg>
  );
}
