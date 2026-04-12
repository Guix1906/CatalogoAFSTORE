import { Menu, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Lançamentos", to: "/novidades" },
    { label: "Feminino", to: "/categoria/feminino" },
    { label: "Masculino", to: "/categoria/masculino" },
    { label: "Outlet", to: "/outlet" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-5">
        <Sheet>
          <SheetTrigger
            className="rounded-full border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] border-border bg-card p-0">
            <SheetHeader className="border-b border-border px-5 py-4 text-left">
              <SheetTitle className="font-display text-2xl tracking-[0.2em] text-gold">AF STORE</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col p-3">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-secondary hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
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
