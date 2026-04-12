import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Nova Coleção Feminina",
    subtitle: "Modelagens premium para performance e estilo",
    image: "https://images.unsplash.com/photo-1518310952931-b1de897abd40?auto=format&fit=crop&w=1200&q=80",
    href: "/categoria/feminino",
  },
  {
    title: "Masculino — Performance e Estilo",
    subtitle: "Peças técnicas para treinos de alta intensidade",
    image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1200&q=80",
    href: "/categoria/masculino",
  },
  {
    title: "Conjuntos com até 30% OFF",
    subtitle: "Ofertas limitadas para renovar seu treino",
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1200&q=80",
    href: "/novidades",
  },
];

export const HeroBanner = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.title}
          initial={{ x: 28, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -28, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="relative h-72"
        >
          <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20 p-6" />
          <div className="absolute inset-0 flex flex-col justify-end gap-3 p-6">
            <h1 className="max-w-[16ch] text-4xl leading-[0.95] text-foreground">{slide.title}</h1>
            <p className="max-w-[32ch] text-sm text-foreground/85">{slide.subtitle}</p>
            <Button asChild className="w-fit rounded-full bg-primary text-primary-foreground hover:bg-accent">
              <Link to={slide.href}>Ver Coleção →</Link>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
