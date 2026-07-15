import { useRoute } from './router';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Apply from './pages/Apply';
import Tracker from './pages/Tracker';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Auth from './pages/Auth';

function AppContent() {
  const route = useRoute();
  const { loading } = useAuth();

  if (loading && route !== 'auth') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-600" />
      </div>
    );
  }

  const showChrome = route !== 'auth' && route !== 'admin-login';

  return (
    <div className="min-h-screen bg-white">
      {showChrome && <Navbar />}
      <main>
        {route === 'home' && <Home />}
        {route === 'about' && <About />}
        {route === 'apply' && <Apply />}
        {route === 'tracker' && <Tracker />}
        {route === 'donate' && <Donate />}
        {route === 'contact' && <Contact />}
        {route === 'admin' && <Admin />}
        {route === 'admin-login' && <AdminLogin />}
        {route === 'auth' && <Auth />}
      </main>
      {showChrome && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
