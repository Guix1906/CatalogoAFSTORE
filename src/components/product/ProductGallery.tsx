import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";

export const ProductGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="space-y-3">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image}>
              <img src={image} alt={`${name} ${index + 1}`} className="h-[360px] w-full rounded-2xl object-cover" loading="lazy" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${current === index ? "w-6 bg-gold" : "w-2 bg-muted"}`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
