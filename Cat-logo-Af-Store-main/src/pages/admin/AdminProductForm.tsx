import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { productService } from '../../services/productService';
import { adminAuthService } from '../../services/adminAuthService';
import { Product } from '../../types';
import { ChevronLeft, Save, Plus, X } from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [authError, setAuthError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const MAX_IMAGES = 6;
  const MAX_IMAGE_SIZE = 3 * 1024 * 1024;
  const ALLOWED_CATEGORIES = ['leggings', 'tops', 'conjuntos', 'masculino', 'feminino'] as const;
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'leggings',
    price: 0,
    description: '',
    sizes: ['P', 'M', 'G'],
    images: [],
    active: true,
    isBestSeller: false,
    isNew: true,
    isOnSale: false,
    gender: 'feminino',
    tags: []
  });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { isAdmin, error: adminError } = await adminAuthService.isAdmin();
        if (!isAdmin) {
          setAuthError(adminError || 'Acesso negado ao painel admin.');
          setLoading(false);
          return;
        }

        if (id) {
          const p = await productService.getProductById(id);
          if (p) {
            setFormData(p);
          } else {
            setNotFound(true);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productName = formData.name?.trim();
    const priceValue = Number(formData.price || 0);

    if (!productName || productName.length < 3) {
      setError('Informe um nome de produto com pelo menos 3 caracteres.');
      return;
    }

    if (!priceValue || priceValue <= 0) {
      setError('Informe um preço válido maior que zero.');
      return;
    }

    if (!ALLOWED_CATEGORIES.includes((formData.category || '') as (typeof ALLOWED_CATEGORIES)[number])) {
      setError('Categoria inválida.');
      return;
    }

    if (!formData.images?.length) {
      setError('Adicione ao menos 1 imagem do produto.');
      return;
    }

    setError('');
    setSaving(true);

    try {
      if (id) {
        await productService.updateProduct(id, formData);
      } else {
        await productService.createProduct(formData);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar produto.';
      if (message.toLowerCase().includes('row-level security')) {
        setError('Seu usuário não tem permissão de admin para salvar produtos.');
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
      reader.readAsDataURL(file);
    });

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentTotal = formData.images?.length || 0;
    if (currentTotal + files.length > MAX_IMAGES) {
      setError(`Você pode ter no máximo ${MAX_IMAGES} imagens por produto.`);
      e.target.value = '';
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith('image/'));
    if (invalidFile) {
      setError('Selecione apenas arquivos de imagem.');
      e.target.value = '';
      return;
    }

    const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE);
    if (oversizedFile) {
      setError('Cada imagem deve ter no máximo 3MB.');
      e.target.value = '';
      return;
    }

    setError('');
    setIsUploadingImage(true);

    try {
      const dataUrls = await Promise.all(files.map((file) => fileToDataUrl(file)));
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...dataUrls],
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar imagem.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
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

  if (notFound) {
    return (
      <PageWrapper>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-sm text-brand-text-muted">Produto não encontrado para edição.</p>
          <button onClick={() => navigate('/admin/dashboard')} className="btn-primary !px-6 !py-3 !text-[10px]">
            Voltar ao dashboard
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="sticky top-0 z-50 px-4 h-16 flex items-center justify-between bg-brand-bg/80 backdrop-blur-md border-b border-brand-border">
        <button onClick={() => navigate('/admin/dashboard')} className="p-2 -ml-2 text-brand-text bg-brand-card rounded-full">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text-muted">
          {id ? 'Editar Produto' : 'Novo Produto'}
        </h2>
        <button onClick={handleSubmit} className="p-2 text-brand-gold" disabled={saving}>
          <Save size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8 pb-24">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Nome do Produto</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-3 text-sm focus:border-brand-gold outline-none"
              placeholder="Ex: Legging High Performance"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Preço (R$)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-3 text-sm focus:border-brand-gold outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Categoria</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value as any})}
                className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-3 text-sm focus:border-brand-gold outline-none appearance-none"
              >
                <option value="leggings">Leggings</option>
                <option value="tops">Tops</option>
                <option value="conjuntos">Conjuntos</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Imagens</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageFileChange}
            className="hidden"
          />
          <div className="grid grid-cols-3 gap-3">
            {formData.images?.map((img, idx) => (
              <div key={idx} className="aspect-square bg-brand-card border border-brand-border rounded-lg relative overflow-hidden">
                <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white"
                  aria-label="Remover imagem"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              disabled={isUploadingImage}
              className="aspect-square bg-brand-card border border-brand-border border-dashed rounded-lg flex flex-col items-center justify-center text-brand-text-muted hover:text-brand-gold transition-colors"
            >
              <Plus size={20} />
              <span className="text-[8px] font-bold uppercase mt-1">
                {isUploadingImage ? 'Carregando...' : 'Adicionar Imagem'}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-500 font-semibold">{error}</p>
        )}

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Descrição</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            rows={4}
            className="w-full bg-brand-card border border-brand-border rounded-lg px-4 py-3 text-sm focus:border-brand-gold outline-none resize-none"
          />
        </div>

        {/* Flags */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-3 p-4 bg-brand-card border border-brand-border rounded-xl cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.active}
              onChange={e => setFormData({...formData, active: e.target.checked})}
              className="accent-brand-gold"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest">Ativo</span>
          </label>
          <label className="flex items-center gap-3 p-4 bg-brand-card border border-brand-border rounded-xl cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.isBestSeller}
              onChange={e => setFormData({...formData, isBestSeller: e.target.checked})}
              className="accent-brand-gold"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest">Mais Vendido</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand-gold text-brand-bg py-5 rounded-full font-bold uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-gold/20"
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </PageWrapper>
  );
}
