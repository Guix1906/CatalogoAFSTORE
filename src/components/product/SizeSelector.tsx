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
  <div className="flex flex-wrap gap-2">
    {sizes.map((size) => (
      <button
        key={size}
        onClick={() => onChange(size)}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition",
          value === size ? "border-gold bg-gold/20 text-gold" : "border-border bg-card text-foreground",
        )}
      >
        {size}
      </button>
    ))}
  </div>
);
