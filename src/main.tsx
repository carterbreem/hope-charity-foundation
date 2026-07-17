import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Log presence (not values) of build-time envs used by the app to make misconfiguration
// easier to diagnose in production builds. Do NOT log secret values.
const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
// eslint-disable-next-line no-console
console.info(`[env] VITE_SUPABASE_URL present: ${hasSupabaseUrl}, VITE_SUPABASE_ANON_KEY present: ${hasSupabaseKey}`);

// Optional Smartsupp dynamic loader: if a VITE_SMARTSUPP_KEY is set, load the widget
// dynamically so different environments can opt into different keys without editing index.html
const smartsuppKey = import.meta.env.VITE_SMARTSUPP_KEY;
if (smartsuppKey) {
  // eslint-disable-next-line no-console
  console.info('[env] VITE_SMARTSUPP_KEY present — loading Smartsupp dynamically');
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://www.smartsuppchat.com/loader.js?${smartsuppKey}`;
  document.head.appendChild(script);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
