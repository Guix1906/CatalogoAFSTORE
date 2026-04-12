import { Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
        
        <Link to="/" className="flex flex-col items-center">
          <h1 className="text-2xl font-serif font-bold tracking-tighter text-brand-gold leading-none">
            AF STORE
          </h1>
          <span className="text-[8px] uppercase tracking-[0.4em] text-brand-text-muted -mt-0.5">
            Fitness com estilo
          </span>
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
