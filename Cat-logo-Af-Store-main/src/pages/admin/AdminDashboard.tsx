import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { productService } from '../../services/productService';
import { configService } from '../../services/configService';
import { Product, AppConfig } from '../../types';
import { Plus, Edit2, Trash2, Power, Settings, LogOut, ExternalLink } from 'lucide-react';
import PriceDisplay from '../../components/ui/PriceDisplay';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }

    const loadData = async () => {
      const [p, c] = await Promise.all([
        productService.getProducts(),
        configService.getConfig()
      ]);
      setProducts(p);
      setConfig(c);
      setLoading(false);
    };
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  if (loading) return null;

  return (
    <PageWrapper>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold text-brand-gold">Painel Admin</h1>
            <p className="text-[10px] text-brand-text-muted uppercase tracking-widest">Gestão da AF STORE</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-brand-text-muted hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Config Section */}
        <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-brand-gold">
            <Settings size={18} />
            <h2 className="text-xs font-bold uppercase tracking-widest">Configurações Gerais</h2>
          </div>
          <div className="grid gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-widest">WhatsApp de Vendas</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{config?.whatsappNumber}</span>
                <button className="text-[10px] text-brand-gold font-bold uppercase tracking-widest">Editar</button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-gold">
              <h2 className="text-xs font-bold uppercase tracking-widest">Produtos ({products.length})</h2>
            </div>
            <button 
              onClick={() => navigate('/admin/produto/novo')}
              className="flex items-center gap-2 bg-brand-gold text-brand-bg px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest"
            >
              <Plus size={14} /> Novo Produto
            </button>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <div 
                key={product.id}
                className={`bg-brand-card border rounded-2xl p-4 flex gap-4 transition-colors ${product.active ? 'border-brand-border' : 'border-red-900/30 opacity-60'}`}
              >
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-brand-bg relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {!product.active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-[8px] font-bold uppercase text-white">Inativo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-sm font-bold text-brand-text line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-brand-text-muted uppercase tracking-widest">{product.category}</p>
                    <PriceDisplay price={product.price} className="mt-1" />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button 
                      className={`p-2 rounded-full transition-colors ${product.active ? 'text-brand-whatsapp hover:bg-brand-whatsapp/10' : 'text-brand-text-muted hover:bg-brand-text-muted/10'}`}
                      title={product.active ? 'Desativar' : 'Ativar'}
                    >
                      <Power size={16} />
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/produto/editar/${product.id}`)}
                      className="p-2 text-brand-text-muted hover:text-brand-gold transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="p-2 text-brand-text-muted hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={() => navigate(`/produto/${product.id}`)}
                      className="p-2 text-brand-text-muted hover:text-brand-text transition-colors"
                      title="Ver no Catálogo"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
