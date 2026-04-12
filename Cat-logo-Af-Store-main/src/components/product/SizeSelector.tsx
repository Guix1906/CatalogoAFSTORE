interface SizeSelectorProps {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-text-muted">
          Tamanho
        </span>
        {selected && (
          <span className="text-[10px] font-medium text-brand-gold uppercase tracking-wider">
            Selecionado: {selected}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={`
              relative w-12 h-12 flex items-center justify-center rounded-full border text-xs font-bold transition-all duration-300
              ${selected === size 
                ? 'bg-brand-gold border-brand-gold text-brand-bg scale-110 shadow-lg shadow-brand-gold/20' 
                : 'bg-transparent border-brand-border text-brand-text hover:border-brand-gold/50 hover:text-brand-gold'}
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
