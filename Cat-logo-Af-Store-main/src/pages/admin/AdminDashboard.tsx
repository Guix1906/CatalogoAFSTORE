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
    try {
      const [p, c] = await Promise.all([
        productService.getProducts(),
        configService.getConfig(),
      ]);
      setProducts(p);
      setConfig(c);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao carregar dados do painel.');
    }
  };

  useEffect(() => {
    const loadProtectedData = async () => {
      try {
        const { isAdmin, error } = await adminAuthService.isAdmin();
        if (!isAdmin) {
          setAuthError(error || 'Acesso negado.');
          return;
        }

        await loadData();
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : 'Falha ao validar acesso.');
      }
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

  const handleLogout = async () => {
    await adminAuthService.signOut();
    navigate('/admin');
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (authError) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-brand-text-muted">{authError}</p>
          <button onClick={() => navigate('/admin')} className="btn-primary !px-6 !py-3 !text-[10px]">
            Ir para login admin
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif italic text-brand-gold">Painel Admin</h1>
            <p className="text-[9px] font-sans font-extrabold text-brand-text-muted uppercase tracking-[0.2em]">Gestão da Antigravity</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-brand-text-muted hover:text-brand-gold-light transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Config Section */}
        <section className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-brand-gold">
            <Settings size={18} />
            <h2 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em]">Configurações Gerais</h2>
          </div>
          <div className="grid gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-sans font-bold text-brand-text-muted uppercase tracking-[0.2em]">WhatsApp de Vendas</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{config?.whatsappNumber}</span>
                <button
                  onClick={handleEditWhatsApp}
                  className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.1em]"
                >
                  Editar
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-sans font-bold text-brand-text-muted uppercase tracking-[0.2em]">Imagens do Banner Inicial (até 4)</span>
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {(config?.heroImageUrls?.length ? config.heroImageUrls : config?.heroImageUrl ? [config.heroImageUrl] : []).map((url, index) => (
                    <div key={`${url}-${index}`} className="w-full h-16 rounded-lg overflow-hidden bg-brand-bg border border-brand-border">
                      <img
                        src={url}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - (config?.heroImageUrls?.length ?? (config?.heroImageUrl ? 1 : 0))) }).map((_, index) => (
                    <div key={`empty-${index}`} className="w-full h-16 rounded-lg border border-brand-border bg-brand-bg/40 flex items-center justify-center text-[10px] text-brand-text-muted uppercase tracking-widest">
                      Vazio
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSelectHeroImage}
                  className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.1em]"
                >
                  Adicionar Imagens
                </button>
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
          </div>
        </section>

        {actionError && <p className="text-xs text-brand-gold-light font-semibold">{actionError}</p>}

        {/* Products Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-brand-gold">
              <h2 className="text-[11px] font-sans font-extrabold uppercase tracking-[0.2em]">Produtos ({products.length})</h2>
            </div>
            <button
              onClick={() => navigate('/admin/produto/novo')}
              className="btn-primary flex items-center gap-2 !px-4 !py-2 !text-[9px]"
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
                      className="p-2 text-brand-text-muted hover:text-brand-gold-light transition-colors"
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
