import { supabase } from '../integrations/supabase/client';

const NO_ROWS_CODE = 'PGRST116';

export const adminAuthService = {
  async isAdminUser(): Promise<{ isAdmin: boolean; error?: string }> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAdmin: false, error: 'Faça login para continuar.' };
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error && error.code !== NO_ROWS_CODE) {
      return { isAdmin: false, error: 'Não foi possível validar permissão de administrador.' };
    }

    return { isAdmin: Boolean(data) };
  },

  async hasSession(): Promise<boolean> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return Boolean(session);
  },

  async signOut() {
    await supabase.auth.signOut();
  },
};
