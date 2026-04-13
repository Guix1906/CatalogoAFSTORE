import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { productService } from '../../services/productService';
import { configService } from '../../services/configService';
import { adminAuthService } from '../../services/adminAuthService';
import { Product, AppConfig } from '../../types';
import { Plus, Edit2, Trash2, Power, Settings, LogOut, ExternalLink, Package, MoreHorizontal } from 'lucide-react';
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
    <div className="flex h-screen bg-[#0F0F0F] text-[#E5E5E5] overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-[#121212] border-r border-white/5 hidden md:flex flex-col justify-between py-8 px-6">
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
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-6 py-5 bg-[#121212] border-b border-white/5">
          <div className="space-y-0.5">
            <h1 className="text-lg font-serif italic text-white">Admin<span className="text-brand-gold">.</span></h1>
          </div>
          <button onClick={handleLogout} className="p-2 text-[#888] hover:text-white">
            <LogOut size={18} />
          </button>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 md:py-12 space-y-12">
          {/* Config Section */}
          <section className="bg-[#181818] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-[#888]" />
              <h2 className="text-sm font-semibold text-white tracking-wide">Configurações Gerais</h2>
            </div>
            
            <div className="grid gap-8">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">WhatsApp de Vendas</span>
                <div className="flex items-center justify-between bg-[#0F0F0F] rounded-xl px-4 py-3 border border-white/5">
                  <span className="text-sm font-medium tracking-wider text-white">{config?.whatsappNumber}</span>
                  <button
                    onClick={handleEditWhatsApp}
                    className="text-[11px] text-[#888] hover:text-brand-gold font-bold uppercase tracking-wider transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Mídia Inicial (Banners)</span>
                
                <div className="flex flex-wrap gap-4">
                  {(config?.heroImageUrls?.length ? config.heroImageUrls : config?.heroImageUrl ? [config.heroImageUrl] : []).map((url, index) => (
                    <div key={`${url}-${index}`} className="relative w-32 aspect-video rounded-xl overflow-hidden bg-black border border-white/10 group">
                      <img src={url} alt={`Banner ${index + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                          onClick={() => handleRemoveImage(index)}
                          className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                          title="Remover Imagem"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {Math.max(0, 4 - (config?.heroImageUrls?.length ?? (config?.heroImageUrl ? 1 : 0))) > 0 && (
                     <button
                       onClick={handleSelectHeroImage}
                       className="w-32 aspect-video rounded-xl border border-dashed border-white/10 bg-[#0F0F0F] flex flex-col items-center justify-center gap-2 text-[#888] hover:text-white hover:border-white/30 transition-all hover:bg-white/5"
                     >
                       <Plus size={18} />
                     </button>
                  )}
                </div>

                <input ref={heroImageInputRef} type="file" accept="image/*" multiple onChange={handleHeroImageChange} className="hidden" />
              </div>
            </div>
          </section>

          {actionError && <p className="text-xs text-red-400 font-medium px-4 py-3 bg-red-400/10 rounded-lg">{actionError}</p>}

          {/* Products Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-white tracking-wide">
                Produtos <span className="text-[#888] ml-2">({products.length})</span>
              </h2>
              <button
                onClick={() => navigate('/admin/produto/novo')}
                className="bg-brand-gold hover:bg-brand-gold-light text-black font-bold text-[11px] uppercase tracking-wider px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-brand-gold/20"
              >
                <Plus size={16} /> Adicionar Produto
              </button>
            </div>

            <div className="grid gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#181818] border border-white/5 hover:border-brand-gold/30 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#0F0F0F] relative flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className={`w-full h-full object-cover ${!product.active ? 'grayscale opacity-50' : ''}`} referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-[#888] uppercase tracking-widest">{product.category}</span>
                        {product.active ? (
                           <span className="text-[9px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Ativo</span>
                        ) : (
                           <span className="text-[9px] font-bold uppercase tracking-wider text-[#888] bg-white/5 px-2 py-0.5 rounded-full">Pausado</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden md:block">
                      <span className="text-sm font-medium text-white">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigate(`/produto/${product.id}`)} className="p-2 text-[#888] hover:text-white transition-colors" title="Visualizar">
                        <ExternalLink size={16} />
                      </button>
                      <button onClick={() => navigate(`/admin/produto/editar/${product.id}`)} className="p-2 text-[#888] hover:text-white transition-colors" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      
                      {/* Reticências para mais opções */}
                      <div className="relative group/menu">
                        <button className="p-2 text-[#888] hover:text-white transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#181818] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 flex flex-col p-1">
                           <button onClick={() => handleToggleProduct(product)} className="w-full text-left px-3 py-2 text-xs font-medium text-white hover:bg-white/5 rounded-lg">
                             {product.active ? 'Pausar da vitrine' : 'Reativar na vitrine'}
                           </button>
                           <button onClick={() => handleDeleteProduct(product)} className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg">
                             Excluir permanentemente
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="bg-[#181818] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#888]">
                     <Package size={20} />
                  </div>
                  <p className="text-xs uppercase tracking-widest font-extrabold text-[#888]">Nenhum produto cadastrado no momento.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
