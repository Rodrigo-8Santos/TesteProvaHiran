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

  // Excluir conta do usuário (AGORA CHAMA A EDGE FUNCTION)
  async deleteUserAccount(userId) {
    try {
      console.log(`Invoking Edge Function 'delete-user' for userId: ${userId}`);
      
      // Chama a Edge Function 'delete-user'
      const { data, error: functionError } = await supabase.functions.invoke(
        'delete-user', // Nome da sua Edge Function
        {
          body: { userId: userId }, // Passa o userId no corpo da requisição
        }
      );

      // Verifica se houve erro ao invocar ou executar a função
      if (functionError) {
        console.error("Erro ao invocar/executar a Edge Function:", functionError);
        // Tenta extrair uma mensagem de erro mais específica, se disponível
        const errorMessage = functionError.context?.error?.message || functionError.message || "Falha ao executar a exclusão no servidor.";
        throw new Error(errorMessage);
      }

      // Se a função foi invocada e executada sem erros (status 2xx)
      console.log("Edge Function 'delete-user' executed successfully:", data);
      return { error: null }; // Indica sucesso para o frontend

    } catch (error) {
      // Captura erros da invocação ou erros lançados pela própria função
      console.error("Erro geral ao tentar excluir conta via Edge Function:", error);
      // Retorna o erro para o frontend tratar (ex: exibir no toast)
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
