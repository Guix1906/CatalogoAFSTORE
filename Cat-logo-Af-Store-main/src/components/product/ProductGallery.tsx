import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-card">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-bg/50 backdrop-blur-md rounded-full text-brand-text"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-brand-bg/50 backdrop-blur-md rounded-full text-brand-text"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === current ? 'w-6 bg-brand-gold' : 'w-1.5 bg-brand-text/20'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
