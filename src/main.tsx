import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import { MockOAuthPage } from './pages/MockOAuthPage';
import './index.css';

const isMockOAuth = window.location.search.includes('mock_oauth=true');
const GOOGLE_CLIENT_ID = '343639237864-13b40p009vie5mt6me1ouag4jutp73rk.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {isMockOAuth ? <MockOAuthPage /> : <App />}
    </GoogleOAuthProvider>
  </StrictMode>
);
