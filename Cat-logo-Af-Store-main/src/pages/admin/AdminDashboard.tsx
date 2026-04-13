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
        heroImageUrls: config.heroImageUrls,
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

    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    if (files.length > 4) {
      setActionError('Selecione no máximo 4 imagens.');
      event.target.value = '';
      return;
    }

    try {
      const invalidFile = files.find((file) => !file.type.startsWith('image/'));
      if (invalidFile) {
        throw new Error('Arquivo inválido. Selecione apenas imagens.');
      }

      const oversizedFile = files.find((file) => file.size > 3 * 1024 * 1024);
      if (oversizedFile) {
        throw new Error('Cada imagem deve ter no máximo 3MB.');
      }

      const heroImageUrls = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(new Error('Falha ao ler uma das imagens.'));
              reader.readAsDataURL(file);
            })
        )
      );

      await configService.updateConfig({
        whatsappNumber: config.whatsappNumber,
        whatsappMessage: config.whatsappMessage,
        heroImageUrl: heroImageUrls[0],
        heroImageUrls,
      });

      await loadData();
      setActionError('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar imagens do banner.');
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    if (!config) return;
    const confirmed = window.confirm('Deseja remover esta imagem do banner?');
    if (!confirmed) return;

    try {
      const newUrls = (config.heroImageUrls || []).filter((_, i) => i !== indexToRemove);
      const firstUrl = newUrls.length > 0 ? newUrls[0] : '';
      
      await configService.updateConfig({
        whatsappNumber: config.whatsappNumber,
        whatsappMessage: config.whatsappMessage,
        heroImageUrl: firstUrl,
        heroImageUrls: newUrls,
      });

      await loadData();
      setActionError('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao remover imagem.');
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
      <div className="px-6 pt-12 pb-24 space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif italic text-brand-text">Painel Admin</h1>
            <p className="text-[9px] font-sans font-extrabold text-brand-text-muted/60 uppercase tracking-[0.2em]">Gestão da Antigravity</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-3 bg-brand-card/50 rounded-full text-brand-text-muted hover:text-brand-gold hover:bg-brand-card transition-colors"
            title="Sair do Modo Admin"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Config Section */}
        <section className="bg-[#121212] border border-brand-border/30 rounded-3xl p-7 space-y-6 shadow-2xl">
          <div className="flex items-center gap-2 text-brand-text">
            <Settings size={18} className="text-brand-gold" />
            <h2 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em]">Configurações Gerais</h2>
          </div>
          <div className="grid gap-6">
            <div className="space-y-2">
              <span className="text-[8px] font-sans font-bold text-brand-text-muted/50 uppercase tracking-[0.3em]">WhatsApp de Vendas</span>
              <div className="flex items-center justify-between bg-brand-bg rounded-xl px-4 py-3 border border-brand-border/30">
                <span className="text-sm font-medium tracking-wider text-brand-text">{config?.whatsappNumber}</span>
                <button
                  onClick={handleEditWhatsApp}
                  className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.1em] hover:text-brand-gold-light"
                >
                  Editar
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[8px] font-sans font-bold text-brand-text-muted/50 uppercase tracking-[0.3em]">Imagens do Banner Inicial (Até 4)</span>
              
              <div className="flex flex-wrap gap-4">
                {(config?.heroImageUrls?.length ? config.heroImageUrls : config?.heroImageUrl ? [config.heroImageUrl] : []).map((url, index) => (
                  <div key={`${url}-${index}`} className="relative w-28 h-16 rounded-xl overflow-hidden bg-brand-bg border border-brand-border/30 group">
                    <img
                      src={url}
                      alt={`Banner ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => handleRemoveImage(index)}
                        className="p-2 text-white hover:text-red-400 transition-colors"
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {Math.max(0, 4 - (config?.heroImageUrls?.length ?? (config?.heroImageUrl ? 1 : 0))) > 0 && (
                  <button
                    onClick={handleSelectHeroImage}
                    className="w-28 h-16 rounded-xl border border-dashed border-brand-border/50 bg-brand-bg/20 flex flex-col items-center justify-center gap-1 text-brand-text-muted hover:text-brand-gold hover:border-brand-gold/50 transition-colors"
                    title="Adicionar imagem"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <input
                ref={heroImageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleHeroImageChange}
                className="hidden"
              />
            </div>
          </div>
        </section>

        {actionError && <p className="text-xs text-brand-gold-light font-semibold">{actionError}</p>}

        {/* Products Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-text">
              <h2 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em]">Produtos Cadastrados ({products.length})</h2>
            </div>
            <button
              onClick={() => navigate('/admin/produto/novo')}
              className="btn-primary flex items-center gap-2 !px-5 !py-2.5 !text-[10px]"
            >
              <Plus size={14} /> Novo Produto
            </button>
          </div>

          <div className="grid gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className={`bg-[#131313] border shadow-lg rounded-3xl p-5 flex gap-5 transition-all duration-300 ${product.active ? 'border-brand-border/30 hover:border-brand-border/60' : 'border-red-900/20 opacity-70 grayscale-[20%]'}`}
              >
                <div className="w-24 h-28 rounded-xl overflow-hidden bg-brand-bg relative flex-shrink-0">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {!product.active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FF5555]">Inativo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-brand-text-muted/70 uppercase tracking-[0.2em] mt-0.5 mb-2">{product.category}</p>
                    <PriceDisplay price={product.price} />
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleToggleProduct(product)}
                      className={`p-2.5 rounded-full transition-colors font-bold ${
                        product.active 
                          ? 'text-[#4CAF50] hover:bg-[#4CAF50]/10' 
                          : 'text-[#FF5555] hover:bg-[#FF5555]/10'
                      }`}
                      title={product.active ? "Desativar da Vitrine" : "Ativar na Vitrine"}
                    >
                      <Power size={16} />
                    </button>
                    <div className="w-px h-4 bg-brand-border/50 mx-1" />
                    <button
                      onClick={() => navigate(`/admin/produto/editar/${product.id}`)}
                      className="p-2.5 text-brand-text-muted hover:text-white transition-colors"
                      title="Editar informações do produto"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="p-2.5 text-brand-text-muted hover:text-red-400 transition-colors"
                      title="Excluir produto permanentemente"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/produto/${product.id}`)}
                      className="p-2.5 text-brand-text-muted hover:text-brand-gold transition-colors"
                      title="Testar visualização na loja"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="bg-[#121212] border border-brand-border/30 rounded-3xl p-10 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-brand-card/50 rounded-full flex items-center justify-center text-brand-text-muted">
                   <Settings size={24} className="opacity-50" />
                </div>
                <p className="text-[11px] uppercase tracking-widest font-extrabold text-brand-text-muted/60">Nenhum produto cadastrado no momento.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
