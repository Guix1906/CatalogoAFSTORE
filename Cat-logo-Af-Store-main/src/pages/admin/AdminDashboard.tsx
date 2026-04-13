import React, { useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useConfig, useProductMutations } from '../../hooks/useOptimizedQueries';
import { adminAuthService } from '../../services/adminAuthService';
import { configService } from '../../services/configService';
import { Plus, Edit2, Trash2, Settings, LogOut, ExternalLink, Package, MoreHorizontal } from 'lucide-react';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [actionError, setActionError] = useState('');
  const heroImageInputRef = useRef<HTMLInputElement | null>(null);

  const { data: products = [], isLoading: isLoadingProducts, refetch: refetchProducts } = useProducts(0, 500);
  const { data: config, isLoading: isLoadingConfig, refetch: refetchConfig } = useConfig();
  const { toggleActive, deleteProduct } = useProductMutations();

  useEffect(() => {
    const checkAuth = async () => {
      const { isAdmin } = await adminAuthService.isAdmin();
      if (!isAdmin) {
        navigate('/admin');
      } else {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleToggleProduct = async (product: any) => {
    setActionError('');
    try {
      await toggleActive.mutateAsync({ id: product.id, active: !product.active });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar status.');
    }
  };

  const handleDeleteProduct = async (product: any) => {
    const confirmed = window.confirm(`Deseja excluir o produto "${product.name}"?`);
    if (!confirmed) return;

    setActionError('');
    try {
      await deleteProduct.mutateAsync(product.id);
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
        ...config,
        whatsappNumber: normalized,
      });
      refetchConfig();
      setActionError('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar WhatsApp.');
    }
  };

  const handleHeroImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return;
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    try {
      const heroImageUrls = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(new Error('Falha ao ler imagens.'));
              reader.readAsDataURL(file);
            })
        )
      );

      await configService.updateConfig({
        ...config,
        heroImageUrl: heroImageUrls[0],
        heroImageUrls,
      });

      refetchConfig();
      setActionError('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao atualizar imagens.');
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
      await configService.updateConfig({
        ...config,
        heroImageUrl: newUrls[0] || '',
        heroImageUrls: newUrls,
      });
      refetchConfig();
    } catch (err) {
      setActionError('Erro ao remover imagem.');
    }
  };

  const handleLogout = async () => {
    await adminAuthService.signOut();
    navigate('/admin');
  };

  if (!authChecked) return null;

  const loading = isLoadingProducts || isLoadingConfig;

  return (
    <div className="flex h-screen bg-[#0F0F0F] text-[#E5E5E5] overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-[#121212] border-r border-white/5 hidden md:flex flex-col justify-between py-8 px-6 flex-shrink-0">
        <div>
          <div className="mb-12">
            <h1 className="text-xl font-serif italic text-white tracking-wide">Admin<span className="text-brand-gold">.</span></h1>
            <p className="text-[9px] font-sans font-extrabold text-[#888] uppercase tracking-[0.2em] mt-1">Antigravity</p>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-[#181818] border border-white/5 rounded-xl text-white font-medium text-sm transition-colors shadow-sm">
              <Package size={18} className="text-brand-gold" />
              Produtos
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#181818] border border-transparent rounded-xl text-[#888] hover:text-white font-medium text-sm transition-colors">
              <Settings size={18} />
              Configurações
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-[#888] hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm font-medium w-full"
        >
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden flex items-center justify-between px-6 py-5 bg-[#121212] border-b border-white/5 sticky top-0 z-40">
          <h1 className="text-lg font-serif italic text-white">Admin<span className="text-brand-gold">.</span></h1>
          <button onClick={handleLogout} className="p-2 text-[#888] hover:text-white">
            <LogOut size={18} />
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 md:py-12 space-y-12">
          {loading ? (
            <div className="space-y-12 animate-pulse">
              <div className="h-48 bg-[#181818] rounded-2xl border border-white/5 w-full" />
              <div className="space-y-6">
                <div className="h-8 w-48 bg-[#181818] rounded-lg" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-[#181818] rounded-2xl border border-white/5" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Config Section */}
              <section className="bg-[#181818] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-[#888]" />
                  <h2 className="text-sm font-semibold text-white tracking-wide uppercase tracking-[0.1em]">Geral</h2>
                </div>
                
                <div className="grid gap-8">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-[#888] uppercase tracking-[0.2em]">WhatsApp</span>
                    <div className="flex items-center justify-between bg-[#0F0F0F] rounded-xl px-4 py-3 border border-white/5">
                      <span className="text-sm font-medium tracking-wider text-white">{config?.whatsappNumber}</span>
                      <button onClick={handleEditWhatsApp} className="text-[11px] text-brand-gold hover:text-brand-gold-light font-bold uppercase tracking-wider transition-colors">
                        Editar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-[#888] uppercase tracking-[0.2em]">Banners Principais</span>
                    <div className="flex flex-wrap gap-4">
                      {(config?.heroImageUrls || []).map((url, index) => (
                        <div key={index} className="relative w-32 aspect-video rounded-xl overflow-hidden bg-[#0F0F0F] border border-white/5 group">
                          <img src={url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <button onClick={() => handleRemoveImage(index)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all duration-200">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => heroImageInputRef.current?.click()} className="w-32 aspect-video rounded-xl border border-dashed border-white/10 bg-[#0F0F0F] flex flex-col items-center justify-center gap-2 text-[#888] hover:text-white hover:border-brand-gold/30 transition-all hover:bg-white/5">
                        <Plus size={18} />
                      </button>
                    </div>
                    <input ref={heroImageInputRef} type="file" accept="image/*" multiple onChange={handleHeroImageChange} className="hidden" />
                  </div>
                </div>
              </section>

              {actionError && <p className="text-xs text-red-400 font-medium px-4 py-3 bg-red-400/10 rounded-lg">{actionError}</p>}

              {/* Products Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h2 className="text-sm font-semibold text-white uppercase tracking-[0.1em]">
                    Catálogo <span className="text-[#888] ml-2 text-[10px]">({products.length})</span>
                  </h2>
                  <button onClick={() => navigate('/admin/produto/novo')} className="btn-primary !py-3 !text-[10px] flex items-center gap-2">
                    <Plus size={16} /> Novo Produto
                  </button>
                </div>

                <div className="grid gap-3 pb-20">
                  {products.map((product) => (
                    <div key={product.id} className="bg-[#181818] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0F0F0F] border border-white/5 flex-shrink-0">
                          <img src={product.images[0]} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!product.active ? 'grayscale opacity-50' : ''}`} loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm truncate uppercase tracking-tight">{product.name}</h3>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] text-[#888] font-bold uppercase tracking-wider">{product.category}</span>
                            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm ${product.active ? 'bg-brand-gold text-black' : 'bg-white/5 text-[#888] border border-white/5'}`}>
                              {product.active ? 'Ativo' : 'Pausado'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                          <span className="text-sm font-bold text-white tracking-tight">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
                          <button onClick={() => navigate(`/produto/${product.id}`)} className="p-2.5 text-[#888] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <ExternalLink size={16} />
                          </button>
                          <button onClick={() => navigate(`/admin/produto/editar/${product.id}`)} className="p-2.5 text-[#888] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                            <Edit2 size={16} />
                          </button>
                          <div className="relative group/menu">
                            <button className="p-2.5 text-[#888] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                              <MoreHorizontal size={16} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-52 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 flex flex-col p-1.5 shadow-black">
                               <button onClick={() => handleToggleProduct(product)} className="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-white/5 rounded-lg">
                                 {product.active ? 'Suspender Vendas' : 'Ativar Vendas'}
                               </button>
                               <div className="h-px bg-white/5 my-1" />
                               <button onClick={() => handleDeleteProduct(product)} className="w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 rounded-lg">
                                 Excluir Produto
                               </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

