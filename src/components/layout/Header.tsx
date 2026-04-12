import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/30 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <span className="w-5" />
        <Link to="/" className="text-2xl font-semibold tracking-[0.25em] text-gold font-display" aria-label="AF STORE">
          AF STORE
        </Link>
        <button
          className="rounded-full border border-border p-2 text-muted-foreground transition hover:text-gold"
          onClick={() => navigate("/busca")}
          aria-label="Abrir busca"
        >
          <Search size={18} />
        </button>
      </div>
    </header>
  );
};
