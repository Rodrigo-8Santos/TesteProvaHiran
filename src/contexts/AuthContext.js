import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth';
import { userService } from '../services/users';
import supabase from '../services/supabase';

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await authService.getCurrentUser();
        
        if (error) {
          throw error;
        }

        if (data?.user) {
          setUser(data.user);
          
          // Buscar o perfil do usuário
          const { data: profileData, error: profileError } = await userService.getCurrentUserProfile();
          
          if (profileError) {
            throw profileError;
          }
          
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Função para registrar um novo usuário
  const register = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando processo de registro com:', email);
      
      // Tentar registrar o usuário usando o método admin.createUser
      const { data, error } = await authService.register(email, password, userData);
      
      if (error) {
        console.error('Erro durante o registro:', error);
        throw error;
      }
      
      // O usuário já está autenticado após o registro
      if (data?.user) {
        console.log('Usuário registrado com sucesso:', data.user.id);
        setUser(data.user);
        
        // Buscar o perfil do usuário após registro
        const { data: profileData, error: profileError } = await userService.getCurrentUserProfile();
        
        if (profileError) {
          console.error('Erro ao buscar perfil após registro:', profileError);
          
          // Se não encontrar perfil, pode ser que o perfil ainda não tenha sido criado
          // Tentar criar o perfil manualmente
          if (!profileData) {
            console.log('Tentando criar perfil manualmente');
            const { error: createProfileError } = await supabase
              .from('usuarios')
              .insert([
                {
                  id: data.user.id,
                  nome: userData.nome,
                  idade: userData.idade,
                  descricao: userData.descricao,
                  email: email
                }
              ]);
            
            if (createProfileError) {
              console.error('Erro ao criar perfil manualmente:', createProfileError);
              throw createProfileError;
            }
            
            // Buscar o perfil recém-criado
            const { data: newProfileData, error: newProfileError } = await userService.getCurrentUserProfile();
            
            if (newProfileError) {
              console.error('Erro ao buscar perfil recém-criado:', newProfileError);
              throw newProfileError;
            }
            
            setProfile(newProfileData);
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);
        }
      } else {
        console.error('Registro bem-sucedido, mas sem dados de usuário');
        throw new Error('Falha ao obter dados do usuário após registro');
      }
      
      return { success: true };
    } catch (err) {
      console.error('Erro final no processo de registro:', err);
      setError(err.message || 'Erro desconhecido durante o registro');
      return { success: false, error: err.message || 'Erro desconhecido durante o registro' };
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer login
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await authService.login(email, password);
      if (error) {
        throw error;
      }
      setUser(data.user);
      // Buscar o perfil do usuário
      let { data: profileData, error: profileError } = await userService.getCurrentUserProfile();
      if (profileError) {
        throw profileError;
      }
      // Se não existir perfil, cria automaticamente
      if (!profileData) {
        // Aqui você pode pedir dados extras do usuário, ou usar placeholders
        const { data: createdProfile, error: createProfileError } = await userService.createUserProfile({
          id: data.user.id,
          nome: data.user.user_metadata?.nome || '',
          idade: null,
          descricao: '',
          email: data.user.email
        });
        if (createProfileError) throw createProfileError;
        // Buscar o perfil recém-criado
        ({ data: profileData, error: profileError } = await userService.getCurrentUserProfile());
        if (profileError) throw profileError;
      }
      setProfile(profileData);
      return { success: true };
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await authService.logout();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setProfile(null);
      return { success: true };
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o perfil do usuário
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data, error } = await userService.updateUserProfile(user.id, userData);
      
      if (error) {
        throw error;
      }
      
      // Atualizar o perfil no estado
      const { data: profileData, error: profileError } = await userService.getCurrentUserProfile();
      
      if (profileError) {
        throw profileError;
      }
      
      setProfile(profileData);
      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Função para excluir a conta do usuário
  const deleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { error } = await userService.deleteUserAccount(user.id);
      
      if (error) {
        throw error;
      }
      
      // Limpar os estados após exclusão
      setUser(null);
      setProfile(null);
      return { success: true };
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Valores e funções disponibilizados pelo contexto
  const value = {
    user,
    profile,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
