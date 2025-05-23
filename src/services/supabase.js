import { createClient } from '@supabase/supabase-js';

// Configuração do cliente Supabase (COM AS CREDENCIAIS DO USUÁRIO)
const supabaseUrl = 'https://enmbadeqhsyrzrxwovce.supabase.co'; // <-- URL DO USUÁRIO
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVubWJhZGVxaHN5cnpyeHdvdmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMzc0NDQsImV4cCI6MjA1ODYxMzQ0NH0.2wFJ2c19BYuRmP9m5mMwlMSELp3enJJVJCQT_fjp1mk'; // <-- CHAVE ANON DO USUÁRIO

// Criação do cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
