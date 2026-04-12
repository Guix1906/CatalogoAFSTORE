import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export const SearchBar = ({ value, onChange, autoFocus }: SearchBarProps) => (
  <div className="relative">
    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
    <Input
      autoFocus={autoFocus}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar por produto, categoria, tag..."
      className="h-11 rounded-full border-gold/30 bg-card pl-10"
    />
  </div>
);
