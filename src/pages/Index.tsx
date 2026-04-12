import { products } from "@/data/products";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryScroll } from "@/components/home/CategoryScroll";
import { ProductSection } from "@/components/home/ProductSection";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";

const Index = () => {
  const bestSellers = products.filter((item) => item.isBestSeller).slice(0, 4);
  const newItems = products.filter((item) => item.isNew).slice(0, 6);
  const saleItems = products.filter((item) => item.isOnSale).slice(0, 4);

  return (
    <PageWrapper>
      <div className="space-y-7">
        <HeroBanner />
        <CategoryScroll />
        <ProductSection title="Mais Vendidos" products={bestSellers} />
        <ProductSection title="Novidades" products={newItems} horizontal />
        <section className="space-y-3 rounded-2xl border border-gold/30 bg-card p-3">
          <div>
            <h2 className="text-2xl text-gold">Promoções</h2>
            <p className="text-xs text-muted-foreground">Seleção limitada com descontos exclusivos</p>
          </div>
          <ProductSection title="" products={saleItems} />
        </section>
        <WhatsAppBanner />
      </div>
    </PageWrapper>
  );
};

export default Index;
