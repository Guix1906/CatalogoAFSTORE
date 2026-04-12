import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import { Lock } from 'lucide-react';
import { supabase } from '../../integrations/supabase/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || password.length < 6) {
      setError('Use um email válido e senha com no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        setMessage('Cadastro realizado. Verifique seu email para confirmar a conta e depois entrar no painel.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin/dashboard`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar com Google');
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin/dashboard');
      }
    };

    checkSession();
  }, [navigate]);

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

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-text-muted">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Digite sua senha"
                minLength={6}
                required
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              {message && <p className="text-xs text-brand-gold">{message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-bg py-4 rounded-lg font-bold uppercase text-xs tracking-widest hover:bg-brand-gold-light transition-colors"
            >
              {loading ? 'Processando...' : isRegisterMode ? 'Cadastrar Admin' : 'Entrar no Painel'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegisterMode((prev) => !prev);
                setError('');
                setMessage('');
              }}
              className="w-full text-[10px] font-bold uppercase tracking-widest text-brand-text-muted hover:text-brand-gold transition-colors"
            >
              {isRegisterMode ? 'Já tenho conta' : 'Criar nova conta'}
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-brand-border text-brand-text py-3 rounded-lg font-bold uppercase text-[10px] tracking-widest hover:border-brand-gold transition-colors"
            >
              Entrar com Google
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
