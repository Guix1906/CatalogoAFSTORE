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

  async signOut() {
    await supabase.auth.signOut();
  },
};
