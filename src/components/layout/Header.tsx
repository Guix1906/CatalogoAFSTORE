import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-5">
        <span className="w-9" />
        <Link to="/" className="font-display text-2xl font-semibold tracking-[0.2em] text-gold" aria-label="AF STORE">
          AF STORE
        </Link>
        <button
          className="rounded-full border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
          onClick={() => navigate("/busca")}
          aria-label="Abrir busca"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
};
