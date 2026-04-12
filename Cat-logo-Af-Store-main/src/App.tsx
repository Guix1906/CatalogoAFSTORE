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

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <Suspense fallback={
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AnimatePresence mode="wait">
        <div key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/produto/:id" element={<ProductPage />} />
            <Route path="/busca" element={<SearchPage />} />
            <Route path="/novidades" element={<NewArrivalsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/produto/novo" element={<AdminProductForm />} />
            <Route path="/admin/produto/editar/:id" element={<AdminProductForm />} />
          </Routes>
        </div>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
