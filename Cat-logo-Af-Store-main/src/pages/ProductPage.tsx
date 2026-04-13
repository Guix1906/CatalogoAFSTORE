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
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [pageError, setPageError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isMeasuresOpen, setIsMeasuresOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) {
          setNotFound(true);
          return;
        }

        const p = await productService.getProductById(id);
        if (!p) {
          setNotFound(true);
          return;
        }

        setProduct(p);
        const related = await productService.getProductsByCategory(p.category);
        setRelatedProducts(related.filter(item => item.id !== p.id).slice(0, 4));
      } catch (err) {
        setPageError(err instanceof Error ? err.message : 'Falha ao carregar produto.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (pageError) return (
    <PageWrapper>
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-brand-text-muted">{pageError}</p>
        <button onClick={() => navigate('/')} className="btn-primary !px-6 !py-3 !text-[10px]">Voltar ao catálogo</button>
      </div>
    </PageWrapper>
  );

  if (notFound || !product) return (
    <PageWrapper>
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-brand-text-muted">Produto não encontrado.</p>
        <button onClick={() => navigate('/')} className="btn-primary !px-6 !py-3 !text-[10px]">Ver catálogo</button>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      {/* Premium Header */}
      <div className="sticky top-0 z-50 px-4 h-20 flex items-center justify-between bg-brand-bg/90 backdrop-blur-xl border-b border-brand-border/50">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center text-brand-text bg-brand-card/50 border border-brand-border rounded-full hover:border-brand-gold transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-sans font-extrabold uppercase tracking-[0.3em] text-brand-gold-light">Antigravity</span>
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.1em] text-brand-text truncate max-w-[150px]">
            {product.name}
          </h2>
        </div>
        <div className="w-10" />
      </div>

      <ProductGallery images={product.images} />

      <div className="p-8 space-y-10">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {product.isBestSeller && <Badge variant="gold">Performance Pick</Badge>}
            {product.isNew && <Badge variant="gold">Lançamento</Badge>}
          </div>
          <h1 className="text-4xl font-serif font-black text-brand-text leading-[1.1] uppercase tracking-tight">
            {product.name}
          </h1>
          <PriceDisplay 
            price={product.price} 
            originalPrice={product.originalPrice} 
            discount={product.discount}
            size="lg"
          />
        </div>

        <div className="space-y-6 bg-brand-card/30 p-6 rounded-3xl border border-brand-border/50">
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
        </div>

        {/* Information Accordions */}
        <div className="space-y-2">
          <div className="bg-brand-card/20 rounded-2xl border border-brand-border/30 overflow-hidden">
            <button 
              onClick={() => setIsDescOpen(!isDescOpen)}
              className="w-full px-6 py-5 flex items-center justify-between text-left group"
            >
              <span className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-brand-text group-hover:text-brand-gold transition-colors">Descrição Técnica</span>
              <ChevronDown size={18} className={`text-brand-gold transition-transform duration-500 ${isDescOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isDescOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  <p className="px-6 pb-6 text-sm font-sans text-brand-text-muted leading-relaxed">
                    {product.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {product.measurements && (
            <div className="bg-brand-card/20 rounded-2xl border border-brand-border/30 overflow-hidden">
              <button 
                onClick={() => setIsMeasuresOpen(!isMeasuresOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2">
                  <Ruler size={14} className="text-brand-gold" />
                  <span className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em] text-brand-text group-hover:text-brand-gold transition-colors">Guia de Fit</span>
                </div>
                <ChevronDown size={18} className={`text-brand-gold transition-transform duration-500 ${isMeasuresOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isMeasuresOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  >
                    <div className="mx-6 mb-6 p-5 bg-black/40 rounded-xl border border-brand-border/30 text-xs font-sans text-brand-text-muted leading-loose whitespace-pre-line">
                      {product.measurements}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sophisticated Related Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-20 space-y-8 pb-32">
            <div className="flex flex-col gap-1 items-center mb-10">
              <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.4em] text-brand-gold-light">Complementos</span>
              <h2 className="text-3xl font-serif font-bold text-brand-text uppercase tracking-tight">Complete seu look</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10">
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
