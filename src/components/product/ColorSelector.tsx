import { ProductColor } from "@/types/product";
import { cn } from "@/lib/utils";

export const ColorSelector = ({
  colors,
  value,
  onChange,
}: {
  colors: ProductColor[];
  value?: ProductColor;
  onChange: (color: ProductColor) => void;
}) => (
  <div className="flex flex-wrap items-center gap-3">
    {colors.map((color) => {
      const isSelected = value?.name === color.name;
      return (
        <button
          key={color.name}
          onClick={() => onChange(color)}
          className={cn("flex items-center gap-2 rounded-full border px-3 py-1.5", isSelected ? "border-gold" : "border-border")}
        >
          <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: color.hex }} />
          <span className="text-xs">{color.name}</span>
        </button>
      );
    })}
  </div>
);
