import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { configService } from '../../services/configService';

const SLIDES = [
  {
    id: 1,
    title: "Nova Coleção Feminina",
    subtitle: "Performance e Elegância",
    image: "https://picsum.photos/seed/fitness-hero1/1200/800",
    link: "/categoria/feminino"
  },
  {
    id: 2,
    title: "Masculino — Performance",
    subtitle: "Estilo sem limites",
    image: "https://picsum.photos/seed/fitness-hero2/1200/800",
    link: "/categoria/masculino"
  },
  {
    id: 3,
    title: "Conjuntos Premium",
    subtitle: "Até 30% OFF selecionados",
    image: "https://picsum.photos/seed/fitness-hero3/1200/800",
    link: "/categoria/conjuntos"
  },
  {
    id: 4,
    title: "Leggings e Tops",
    subtitle: "Conforto para treinar",
    image: "https://picsum.photos/seed/fitness-hero4/1200/800",
    link: "/categoria/leggings"
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [heroImageUrls, setHeroImageUrls] = useState<string[]>([]);
  const navigate = useNavigate();
  const configuredImages = heroImageUrls.filter(Boolean).slice(0, 4);
  const slides = configuredImages.length
    ? configuredImages.map((image, index) => ({
        ...SLIDES[index % SLIDES.length],
        id: index + 1,
        image,
      }))
    : SLIDES;

  useEffect(() => {
    let active = true;

    configService
      .getConfig()
      .then((config) => {
        if (!active) return;
        if (config.heroImageUrls?.length) {
          setHeroImageUrls(config.heroImageUrls.slice(0, 4));
          return;
        }
        setHeroImageUrls(config.heroImageUrl ? [config.heroImageUrl] : []);
      })
      .catch(() => {
        if (active) setHeroImageUrls([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setCurrent((prev) => (prev >= slides.length ? 0 : prev));
  }, [slides.length]);

  return (
    <div className="relative h-[60vh] w-full overflow-hidden bg-brand-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent z-10" />
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-16 px-6 text-center">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-serif font-bold text-brand-text mb-2"
            >
               {slides[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-brand-text-muted text-sm uppercase tracking-widest mb-6"
            >
               {slides[current].subtitle}
            </motion.p>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
               onClick={() => navigate(slides[current].link)}
              className="flex items-center gap-2 bg-brand-gold text-brand-bg px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-gold-light transition-colors"
            >
              Ver Coleção <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${
              i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
