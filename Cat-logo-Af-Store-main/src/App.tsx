import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useEffect, useState, Suspense, lazy } from 'react';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import SidebarMenu from './components/layout/SidebarMenu';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';

// Lazy loading pages for performance
const Home = lazy(() => import('./pages/Home'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const NewArrivalsPage = lazy(() => import('./pages/NewArrivalsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Fallback mínimo — evita layout shift com altura proporcional
const PageFallback = () => <div className="min-h-screen" />;

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Suspense fallback={<PageFallback />}><Home /></Suspense>} />
        <Route path="/categoria/:slug" element={<Suspense fallback={<PageFallback />}><CategoryPage /></Suspense>} />
        <Route path="/produto/:id" element={<Suspense fallback={<PageFallback />}><ProductPage /></Suspense>} />
        <Route path="/busca" element={<Suspense fallback={<PageFallback />}><SearchPage /></Suspense>} />
        <Route path="/novidades" element={<Suspense fallback={<PageFallback />}><NewArrivalsPage /></Suspense>} />
        <Route path="/categorias" element={<Suspense fallback={<PageFallback />}><CategoriesPage /></Suspense>} />
        {/* Admin Routes */}
        <Route path="/admin" element={<Suspense fallback={<PageFallback />}><AdminLogin /></Suspense>} />
        <Route path="/admin/dashboard" element={<Suspense fallback={<PageFallback />}><AdminDashboard /></Suspense>} />
        <Route path="/admin/produto/novo" element={<Suspense fallback={<PageFallback />}><AdminProductForm /></Suspense>} />
        <Route path="/admin/produto/editar/:id" element={<Suspense fallback={<PageFallback />}><AdminProductForm /></Suspense>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Hide global loader organically after initial mounting
    const loader = document.getElementById('global-loader');
    if (loader) {
      // Pequeno timeout para dar tempo da interface estar 100% pronta e componentes de suspense montarem
      const timeout = setTimeout(() => {
        loader.classList.add('loader-hidden');
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, []);

  // We check if we are in an admin route to hide common layout elements
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Header onMenuOpen={() => setIsMenuOpen(true)} />} />
        </Routes>
        
        <SidebarMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        
        <main className="flex-1">
          <AnimatedRoutes />
        </main>

        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="/produto/:id" element={null} />
          <Route path="*" element={<FloatingWhatsApp />} />
        </Routes>

        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<BottomNav />} />
        </Routes>
      </div>
    </Router>
  );
}
