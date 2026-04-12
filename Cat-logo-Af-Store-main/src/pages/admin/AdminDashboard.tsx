import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { productService } from '../../services/productService';
import { configService } from '../../services/configService';
import { adminAuthService } from '../../services/adminAuthService';
import { Product, AppConfig } from '../../types';
import { Plus, Edit2, Trash2, Power, Settings, LogOut, ExternalLink } from 'lucide-react';
import PriceDisplay from '../../components/ui/PriceDisplay';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [actionError, setActionError] = useState('');
  const heroImageInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const loadData = async () => {
    const [p, c] = await Promise.all([
      productService.getProducts(),
      configService.getConfig(),
    ]);
    setProducts(p);
    setConfig(c);
  };

  useEffect(() => {
    const loadProtectedData = async () => {
      const { isAdmin, error } = await adminAuthService.isAdmin();
      if (!isAdmin) {
        setAuthError(error || 'Acesso negado.');
        setLoading(false);
        navigate('/admin');
        return;
      }

      await loadData();
      setLoading(false);
    };

    loadProtectedData();
  }, [navigate]);

  const handleToggleProduct = async (product: Product) => {
    setActionError('');
    try {
      await productService.toggleProductActive(product.id, !product.active);
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar status do produto.');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(`Deseja excluir o produto "${product.name}"?`);
    if (!confirmed) return;

    setActionError('');
    try {
      await productService.deleteProduct(product.id);
      await loadData();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao excluir produto.');
    }
  };

  const handleEditWhatsApp = async () => {
    if (!config) return;

    const whatsappNumber = window.prompt('Informe o WhatsApp de vendas (somente números com DDI):', config.whatsappNumber);
    if (!whatsappNumber) return;

    const normalized = whatsappNumber.trim();
    if (!/^\d{10,15}$/.test(normalized)) {
      setActionError('Número inválido. Use somente números, entre 10 e 15 dígitos.');
      return;
    }

    try {
      await configService.updateConfig({
        whatsappNumber: normalized,
        whatsappMessage: config.whatsappMessage,
        heroImageUrl: config.heroImageUrl,
      });
      await loadData();
      setActionError('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar WhatsApp.');
    }
  };

  const handleSelectHeroImage = () => {
    heroImageInputRef.current?.click();
  };

  const handleHeroImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setActionError('Arquivo inválido. Selecione uma imagem.');
      event.target.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setActionError('A imagem deve ter no máximo 3MB.');
      event.target.value = '';
      return;
    }

    try {
      const heroImageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Falha ao ler a imagem.'));
        reader.readAsDataURL(file);
      });

      await configService.updateConfig({
        whatsappNumber: config.whatsappNumber,
        whatsappMessage: config.whatsappMessage,
        heroImageUrl,
      });

      await loadData();
      setActionError('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar imagem do banner.');
    } finally {
      event.target.value = '';
    }
  };

  const handleLogout = async () => {
    await adminAuthService.signOut();
    navigate('/admin');
  };

  if (loading) return null;
  if (authError) return null;

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
                <button
                  onClick={handleEditWhatsApp}
                  className="text-[10px] text-brand-gold font-bold uppercase tracking-widest"
                >
                  Editar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-widest">Imagem do Banner Inicial</span>
              <div className="flex items-center justify-between gap-3">
                <div className="w-28 h-16 rounded-lg overflow-hidden bg-brand-bg border border-brand-border">
                  {config?.heroImageUrl ? (
                    <img
                      src={config.heroImageUrl}
                      alt="Banner inicial"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-text-muted uppercase tracking-widest">
                      Sem imagem
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSelectHeroImage}
                  className="text-[10px] text-brand-gold font-bold uppercase tracking-widest"
                >
                  Adicionar Imagem
                </button>
                <input
                  ref={heroImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </section>

        {actionError && <p className="text-xs text-red-500 font-semibold">{actionError}</p>}

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
                      onClick={() => handleToggleProduct(product)}
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
                      onClick={() => handleDeleteProduct(product)}
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

            {products.length === 0 && (
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center">
                <p className="text-sm text-brand-text-muted">Nenhum produto no banco ainda.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
