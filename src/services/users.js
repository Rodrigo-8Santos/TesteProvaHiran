import supabase from './supabase';

// Serviço de usuários
export const userService = {
  // Obter perfil do usuário atual
  async getCurrentUserProfile() {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (authData.user) {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle(); // Corrige erro 406 (PGRST116) quando não há registro

        if (error) throw error;
        return { data, error: null };
      }
      return { data: null, error: null };
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      return { data: null, error };
    }
  },

  // Atualizar perfil do usuário
  async updateUserProfile(userId, userData) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          nome: userData.nome,
          idade: userData.idade,
          descricao: userData.descricao,
          updated_at: new Date()
        })
        .eq('id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { data: null, error };
    }
  },

  // Excluir conta do usuário
  async deleteUserAccount(userId) {
    try {
      // Primeiro excluir o registro na tabela de usuários
      const { error: deleteProfileError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', userId);

      if (deleteProfileError) throw deleteProfileError;

      // Depois excluir a autenticação do usuário
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
      
      if (deleteAuthError) {
        // Se não conseguir excluir a autenticação, pelo menos faz logout
        await supabase.auth.signOut();
        console.warn('Não foi possível excluir completamente a autenticação, mas o perfil foi removido');
      }

      return { error: null };
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      return { error };
    }
  },

  // Listar todos os usuários
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, idade, descricao, email, created_at')
        .order('nome', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return { data: null, error };
    }
  },

  // Obter usuário por ID
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, idade, descricao, email, created_at')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao obter usuário por ID:', error);
      return { data: null, error };
    }
  },

  // Criar perfil do usuário
  async createUserProfile(userData) {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          {
            id: userData.id,
            nome: userData.nome,
            idade: userData.idade,
            descricao: userData.descricao,
            email: userData.email
          }
        ]);
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar perfil do usuário:', error);
      return { data: null, error };
    }
  }
};

export default userService;
