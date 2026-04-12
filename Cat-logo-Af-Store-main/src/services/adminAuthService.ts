import { supabase } from '../integrations/supabase/client';

export const adminAuthService = {
  async isAuthenticated(): Promise<{ isAuthenticated: boolean; error?: string }> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAuthenticated: false, error: 'Faça login para continuar.' };
    }
    return { isAuthenticated: true };
  },

  async hasSession(): Promise<boolean> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return Boolean(session);
  },

  async isAdmin(): Promise<{ isAdmin: boolean; error?: string }> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAdmin: false, error: 'Faça login para continuar.' };
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      return { isAdmin: false, error: 'Não foi possível validar sua permissão de admin.' };
    }

    if (!data) {
      return { isAdmin: false, error: 'Seu usuário não possui permissão de administrador.' };
    }

    return { isAdmin: true };
  },

  async signOut() {
    await supabase.auth.signOut();
  },
};
