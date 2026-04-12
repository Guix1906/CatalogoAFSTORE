import { ProductSize } from "@/types/product";
import { cn } from "@/lib/utils";

export const SizeSelector = ({
  sizes,
  value,
  onChange,
}: {
  sizes: ProductSize[];
  value?: ProductSize;
  onChange: (size: ProductSize) => void;
}) => (
  <div className="grid grid-cols-4 gap-2">
    {sizes.map((size) => (
      <button
        key={size}
        onClick={() => onChange(size)}
        className={cn(
          "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
          value === size
            ? "border-gold bg-secondary text-gold"
            : "border-border bg-card text-foreground hover:border-gold/35 hover:text-gold",
        )}
      >
        {size}
      </button>
    ))}
  </div>
);
