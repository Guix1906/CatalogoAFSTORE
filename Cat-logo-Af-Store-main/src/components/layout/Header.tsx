import { Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import storeLogo from '@/assets/logo-af-store.jpeg';

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={onMenuOpen}
          className="p-2 -ml-2 hover:bg-brand-card rounded-full transition-colors text-brand-text"
          aria-label="Menu"
        >
          <Menu size={24} />
        </button>
        
        <Link to="/" className="flex items-center" aria-label="Ir para página inicial">
          <img
            src={storeLogo}
            alt="Logo da loja AF Store"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <button 
          onClick={() => navigate('/busca')}
          className="p-2 -mr-2 hover:bg-brand-card rounded-full transition-colors text-brand-text"
          aria-label="Buscar"
        >
          <Search size={22} />
        </button>
      </div>
    </header>
  );
}
