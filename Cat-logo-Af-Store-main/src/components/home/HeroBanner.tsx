import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { configService } from '../../services/configService';

const SLIDES = [
  {
    id: 1,
    title: "Feminino — Elegance",
    subtitle: "A união entre luxo e movimento",
    image: "/antigravity-assets/hero_banner_performance.png",
    link: "/categoria/feminino"
  },
  {
    id: 2,
    title: "Masculino — Performance",
    subtitle: "Estilo técnico para superar limites",
    image: "https://picsum.photos/seed/fitness-hero2/1200/800",
    link: "/categoria/masculino"
  },
  {
    id: 3,
    title: "Conjuntos — Premium",
    subtitle: "O caimento perfeito para o seu treino",
    image: "https://picsum.photos/seed/fitness-hero3/1200/800",
    link: "/categoria/conjuntos"
  },
  {
    id: 4,
    title: "Leggings — High-Tech",
    subtitle: "Tecnologia têxtil de ponta",
    image: "https://picsum.photos/seed/fitness-hero4/1200/800",
    link: "/categoria/leggings"
  }
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [heroImageUrls, setHeroImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const configuredImages = heroImageUrls.filter(Boolean).slice(0, 4);
  const slides = configuredImages.length
    ? configuredImages.map((image, index) => ({
        ...SLIDES[index % SLIDES.length],
        id: index + 1,
        image,
      }))
    : SLIDES;
  const safeCurrent = slides.length ? current % slides.length : 0;
  const activeSlide = slides[safeCurrent];

  useEffect(() => {
    let active = true;

    configService
      .getConfig()
      .then((config) => {
        if (!active) return;
        if (config.heroImageUrls?.length) {
          setHeroImageUrls(config.heroImageUrls.slice(0, 4));
        } else if (config.heroImageUrl) {
          setHeroImageUrls([config.heroImageUrl]);
        } else {
          setHeroImageUrls([]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (active) {
          setHeroImageUrls([]);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setCurrent((prev) => (prev >= slides.length ? 0 : prev));
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className="relative h-[60vh] w-full overflow-hidden bg-brand-card/30 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin opacity-50" />
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] w-full overflow-hidden bg-brand-bg">
      <AnimatePresence mode="wait">
        <motion.div
          key={safeCurrent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent z-10" />
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="h-full w-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-16 px-6 text-center">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-banner-display text-4xl md:text-6xl font-bold text-brand-text mb-2 leading-tight normal-case"
              >
                {activeSlide.title.includes(' — ') ? (
                  <>
                    <span>{activeSlide.title.split(' — ')[0]}</span>
                    <span className="font-banner-support block text-2xl md:text-3xl font-medium uppercase tracking-[0.2em] mt-2 text-brand-gold">
                      {activeSlide.title.split(' — ')[1]}
                    </span>
                  </>
                ) : (
                  <span>{activeSlide.title}</span>
                )}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-banner-support text-brand-text-muted text-[10px] md:text-xs font-normal uppercase tracking-[0.2em] mb-8"
              >
                 {activeSlide.subtitle}
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                 onClick={() => navigate(activeSlide.link)}
                className="btn-primary flex items-center justify-center gap-2 group"
              >
                Ver Coleção 
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === safeCurrent ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-border/80 hover:bg-brand-text-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
