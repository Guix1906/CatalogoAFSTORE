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
      const { isAuthenticated } = await adminAuthService.isAuthenticated();
      if (!isAuthenticated) {
        navigate('/admin');
        return;
      }

      if (id) {
        const p = await productService.getProductById(id);
        if (p) setFormData(p);
      }
      setLoading(false);
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
      setError(err instanceof Error ? err.message : 'Erro ao salvar produto.');
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
    const url = window.prompt('Cole a URL da imagem:');
    if (!url) return;

    const trimmed = url.trim();
    if (!trimmed.startsWith('http')) {
      setError('A imagem precisa ser uma URL válida começando com http/https.');
      return;
    }

    setError('');
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), trimmed],
    }));
  };

  if (loading) return null;

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
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">Imagens (URLs)</label>
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
              className="aspect-square bg-brand-card border border-brand-border border-dashed rounded-lg flex flex-col items-center justify-center text-brand-text-muted hover:text-brand-gold transition-colors"
            >
              <Plus size={20} />
              <span className="text-[8px] font-bold uppercase mt-1">Add URL</span>
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
