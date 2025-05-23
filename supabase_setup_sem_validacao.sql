-- Criação da tabela de usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  idade INTEGER NOT NULL,
  descricao TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança (Row Level Security)

-- Habilitar RLS na tabela de usuários
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer usuário autenticado possa visualizar informações básicas de todos os usuários
CREATE POLICY "Usuários autenticados podem visualizar todos os usuários" 
ON usuarios FOR SELECT 
USING (auth.role() = 'authenticated');

-- Política para permitir que usuários só possam atualizar seu próprio perfil
CREATE POLICY "Usuários só podem atualizar seu próprio perfil" 
ON usuarios FOR UPDATE 
USING (auth.uid() = id);

-- Política para permitir que usuários só possam inserir seu próprio perfil
CREATE POLICY "Usuários só podem inserir seu próprio perfil" 
ON usuarios FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Política para permitir que usuários só possam excluir seu próprio perfil
CREATE POLICY "Usuários só podem excluir seu próprio perfil" 
ON usuarios FOR DELETE 
USING (auth.uid() = id);

-- Função RPC para confirmar email de usuário manualmente (usando service_role)
CREATE OR REPLACE FUNCTION public.confirm_user_email(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  -- Esta função será chamada pelo código, mas não tentará modificar diretamente auth.users
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
