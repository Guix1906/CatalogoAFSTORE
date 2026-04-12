import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password protection as requested
    if (password === 'afstore123') {
      localStorage.setItem('admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Senha incorreta');
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8 bg-brand-card p-8 rounded-2xl border border-brand-border">
          <div className="text-center space-y-2">
            <div className="bg-brand-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-brand-gold" size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-brand-text">Acesso Restrito</h1>
            <p className="text-xs text-brand-text-muted uppercase tracking-widest">Painel Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
                Senha de Acesso
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Digite a senha"
                required
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-gold text-brand-bg py-4 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-brand-gold-light transition-colors"
            >
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
