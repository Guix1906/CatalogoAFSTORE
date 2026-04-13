import { Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 border-b border-brand-border/30 px-6 h-16 flex items-center justify-between">
      <button 
        onClick={onMenuOpen}
        className="p-2 -ml-2 text-brand-text-muted hover:text-brand-gold transition-colors"
      >
        <Menu size={20} />
      </button>

      <Link to="/" className="flex items-center">
        <img
          src="/af-logo.png"
          alt="AF Store"
          className="h-10 w-auto object-contain"
        />
      </Link>

      <button 
        onClick={() => navigate('/busca')}
        className="p-2 -mr-2 text-brand-text-muted hover:text-brand-gold transition-colors"
      >
        <Search size={20} />
      </button>
    </header>
  );
}
