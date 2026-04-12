import { Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function MainHeader() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/95 border-b border-brand-border/30 px-6 h-16 flex items-center justify-between">
      <button className="p-2 text-brand-text-muted">
        <Menu size={20} />
      </button>

      <Link to="/" className="flex flex-col items-center">
        <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-brand-gold-light -mb-1">Antigravity</span>
        <span className="text-[14px] font-serif font-black uppercase tracking-[0.1em] text-brand-text">Performance</span>
      </Link>

      <button 
        onClick={() => navigate('/busca')}
        className="p-2 text-brand-text-muted"
      >
        <Search size={20} />
      </button>
    </header>
  );
}
