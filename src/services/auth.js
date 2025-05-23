import supabase from './supabase';

// Serviço de autenticação
export const authService = {
  // Registrar um novo usuário
  async register(email, password, userData) {
    try {
      // Garantir que o email tenha formato válido para o Supabase
      // Se não tiver @, adicionar um domínio fictício
      let validEmail = email;
      if (!email.includes('@')) {
        validEmail = `${email}@exemplo.com`;
      } else {
        // Se já tem @, garantir que tenha um domínio válido
        const parts = email.split('@');
        if (parts.length === 2 && !parts[1].includes('.')) {
          validEmail = `${parts[0]}@${parts[1]}.com`;
        }
      }
      
      console.log('Tentando registrar com email:', validEmail);
      
      // Usar o método admin.createUser para criar o usuário com email já confirmado
      const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
        email: validEmail,
        password,
        email_confirm: true,
        user_metadata: {
          nome: userData.nome,
          original_email: email // Guardar o email original
        }
      });
      
      if (adminError) {
        console.error('Erro no registro admin:', adminError);
        
        // Fallback: tentar método alternativo se admin falhar
        // Usar o método signUp padrão
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: validEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              nome: userData.nome,
              original_email: email
            }
          }
        });
        
        if (authError) {
          console.error('Erro no registro padrão:', authError);
          
          // Tentar confirmar o email manualmente via SQL
          const { error: sqlError } = await supabase.rpc('confirm_user_email', {
            user_email: validEmail
          });
          
          if (sqlError) {
            console.error('Erro ao confirmar email via SQL:', sqlError);
            throw authError; // Se tudo falhar, lançar o erro original
          }
        }
      }
      
      // Fazer login após o registro
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: validEmail,
        password,
      });
      
      if (signInError) {
        console.error('Erro no login após registro:', signInError);
        throw signInError;
      }
      
      // Se o login for bem-sucedido, adicionar os dados do usuário na tabela
      if (signInData?.user) {
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert([
            {
              id: signInData.user.id,
              nome: userData.nome,
              idade: userData.idade,
              descricao: userData.descricao,
              email: email // Usar o email original fornecido pelo usuário
            }
          ]);

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw profileError;
        }
        
        return { data: signInData, error: null };
      } else if (adminData?.user) {
        // Se o login falhou mas o admin.createUser funcionou, usar esses dados
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert([
            {
              id: adminData.user.id,
              nome: userData.nome,
              idade: userData.idade,
              descricao: userData.descricao,
              email: email // Usar o email original fornecido pelo usuário
            }
          ]);

        if (profileError) {
          console.error('Erro ao criar perfil (admin):', profileError);
          throw profileError;
        }
        
        return { data: adminData, error: null };
      }

      throw new Error('Falha no registro de usuário');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { data: null, error };
    }
  },

  // Login de usuário
  async login(email, password) {
    try {
      // Garantir que o email tenha formato válido para o Supabase
      // Se não tiver @, adicionar um domínio fictício
      let validEmail = email;
      if (!email.includes('@')) {
        validEmail = `${email}@exemplo.com`;
      } else {
        // Se já tem @, garantir que tenha um domínio válido
        const parts = email.split('@');
        if (parts.length === 2 && !parts[1].includes('.')) {
          validEmail = `${parts[0]}@${parts[1]}.com`;
        }
      }
      
      console.log('Tentando login com email:', validEmail);
      
      // Tentar login normal
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validEmail,
        password,
      });
      
      // Se falhar com erro de email não confirmado
      if (error && error.message && error.message.includes('Email not confirmed')) {
        console.log('Email não confirmado, tentando confirmar manualmente');
        
        // Tentar confirmar o email manualmente via SQL
        const { error: sqlError } = await supabase.rpc('confirm_user_email', {
          user_email: validEmail
        });
        
        if (sqlError) {
          console.error('Erro ao confirmar email via SQL:', sqlError);
        }
        
        // Tentar login novamente após confirmação
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: validEmail,
          password,
        });
        
        if (retryError) {
          console.error('Erro no segundo login após confirmação:', retryError);
          throw retryError;
        }
        
        return { data: retryData, error: null };
      }

      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { data: null, error };
    }
  },

  // Logout de usuário
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { error };
    }
  },

  // Obter usuário atual
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return { data: null, error };
    }
  },

  // Recuperar senha
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return { error };
    }
  }
};

export default authService;
