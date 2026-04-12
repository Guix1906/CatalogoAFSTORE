import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import ProductGallery from '../components/product/ProductGallery';
import SizeSelector from '../components/product/SizeSelector';
import ColorSelector from '../components/product/ColorSelector';
import WhatsAppButton from '../components/product/WhatsAppButton';
import ProductCard from '../components/product/ProductCard';
import PriceDisplay from '../components/ui/PriceDisplay';
import Badge from '../components/ui/Badge';
import { productService } from '../services/productService';
import { Product } from '../types';
import { ChevronLeft, Ruler, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isMeasuresOpen, setIsMeasuresOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const p = await productService.getProductById(id);
        if (p) {
          setProduct(p);
          const related = await productService.getProductsByCategory(p.category);
          setRelatedProducts(related.filter(item => item.id !== p.id).slice(0, 4));
        }
      }
    };
    loadProduct();
  }, [id]);

  if (!product) return null;

  return (
    <PageWrapper>
      <div className="sticky top-0 z-50 px-4 h-16 flex items-center justify-between bg-brand-bg/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-brand-text bg-brand-card rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text-muted truncate max-w-[200px]">
          {product.name}
        </h2>
        <div className="w-10" />
      </div>

      <ProductGallery images={product.images} />

      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {product.isBestSeller && <Badge variant="gold">Mais Vendido</Badge>}
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-text leading-tight">
            {product.name}
          </h1>
          <PriceDisplay 
            price={product.price} 
            originalPrice={product.originalPrice} 
            discount={product.discount}
            size="lg"
          />
        </div>

        {product.colors && (
          <ColorSelector 
            colors={product.colors} 
            selected={selectedColor} 
            onSelect={setSelectedColor} 
          />
        )}

        <SizeSelector 
          sizes={product.sizes} 
          selected={selectedSize} 
          onSelect={setSelectedSize} 
        />

        {/* Accordions */}
        <div className="space-y-4 pt-4">
          <div className="border-t border-brand-border">
            <button 
              onClick={() => setIsDescOpen(!isDescOpen)}
              className="w-full py-4 flex items-center justify-between text-left"
            >
              <span className="text-xs font-bold uppercase tracking-widest">Descrição</span>
              <ChevronDown size={18} className={`transition-transform ${isDescOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDescOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-sm text-brand-text-muted leading-relaxed">
                    {product.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {product.measurements && (
            <div className="border-t border-brand-border">
              <button 
                onClick={() => setIsMeasuresOpen(!isMeasuresOpen)}
                className="w-full py-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <Ruler size={16} className="text-brand-gold" />
                  <span className="text-xs font-bold uppercase tracking-widest">Tabela de Medidas</span>
                </div>
                <ChevronDown size={18} className={`transition-transform ${isMeasuresOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isMeasuresOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4 p-4 bg-brand-card rounded-lg border border-brand-border text-sm text-brand-text-muted font-mono">
                      {product.measurements}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 space-y-6">
            <h2 className="text-xl font-serif font-bold text-brand-gold">Você também pode gostar</h2>
            <div className="grid grid-cols-2 gap-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <WhatsAppButton 
        product={product} 
        selectedSize={selectedSize} 
        selectedColor={selectedColor} 
      />
    </PageWrapper>
  );
}
