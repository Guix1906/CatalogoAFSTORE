import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { products } from "@/data/products";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SizeSelector } from "@/components/product/SizeSelector";
import { ColorSelector } from "@/components/product/ColorSelector";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductBadge } from "@/components/ui/Badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ProductCard } from "@/components/product/ProductCard";
import { WhatsAppButton } from "@/components/product/WhatsAppButton";
import { ProductColor, ProductSize } from "@/types/product";
import { getProductWhatsAppUrl } from "@/lib/whatsapp";

const Product = () => {
  const { id = "" } = useParams();
  const product = products.find((item) => item.id === id);
  const navigate = useNavigate();
  const [size, setSize] = useState<ProductSize | undefined>();
  const [color, setColor] = useState<ProductColor | undefined>();

  const related = useMemo(
    () => products.filter((item) => item.category === product?.category && item.id !== product?.id).slice(0, 4),
    [product],
  );

  if (!product) {
    return (
      <PageWrapper>
        <p className="text-muted-foreground">Produto não encontrado.</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-5 pb-16">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ChevronLeft size={14} /> Voltar
        </button>

        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-3">
          <h1 className="text-4xl leading-tight text-gold-light">{product.name}</h1>
          <PriceDisplay price={product.price} originalPrice={product.originalPrice} discount={product.discount} />
          {product.discount ? <ProductBadge type="oferta" className="w-fit" /> : null}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Escolha o tamanho</p>
          <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
        </div>

        {product.colors?.length ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Escolha a cor</p>
            <ColorSelector colors={product.colors} value={color} onChange={setColor} />
          </div>
        ) : null}

        <Accordion type="single" collapsible className="rounded-2xl border border-border px-3">
          <AccordionItem value="descricao">
            <AccordionTrigger>Descrição</AccordionTrigger>
            <AccordionContent>{product.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="medidas">
            <AccordionTrigger>Tabela de medidas</AccordionTrigger>
            <AccordionContent>{product.measurements ?? "Consulte nosso time no WhatsApp para medidas."}</AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="space-y-3">
          <h2 className="text-2xl text-gold">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-3">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      </div>

      <WhatsAppButton href={getProductWhatsAppUrl(product, size, color?.name)} fixed />
    </PageWrapper>
  );
};

export default Product;
