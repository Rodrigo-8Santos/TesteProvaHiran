import React from 'react';
import { ChakraProvider, extendTheme, Spinner, Center } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import Layout from './components/Layout';
// AuthLayout is used internally by Login and Register pages

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserList from './pages/UserList';

// Tema personalizado (forçando modo escuro)
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff', // Azul principal
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
    // Ajustes para garantir boa legibilidade no modo escuro
    gray: {
      50: '#F7FAFC', // Usado para fundo claro, manter para referência
      100: '#EDF2F7',
      200: '#E2E8F0',
      300: '#CBD5E0',
      400: '#A0AEC0',
      500: '#718096',
      600: '#4A5568',
      700: '#2D3748', // Fundo de card escuro
      800: '#1A202C', // Fundo principal escuro
      900: '#171923', // Fundo mais escuro
    },
  },
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Roboto, sans-serif',
  },
  styles: {
    global: (props) => ({
      body: {
        bg: 'gray.800', // Fundo principal sempre escuro
        color: 'whiteAlpha.900', // Cor de texto padrão para modo escuro
      },
      a: {
        _hover: {
          textDecoration: 'none',
        }
      }
    }),
  },
  // Forçar modo escuro e desabilitar detecção do sistema
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  }
});

// Componente auxiliar para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Usar fundo escuro consistente no spinner
    return (
      <Center bg="gray.800" h="100vh">
        <Spinner size="xl" color="blue.300" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Renderiza o children (página protegida, já dentro do Layout se necessário)
  return children;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota Home pública (dentro do Layout padrão) */}
            <Route 
              path="/" 
              element={
                <Layout>
                  <Home />
                </Layout>
              } 
            />
            
            {/* Rotas de Autenticação (usam AuthLayout internamente) */}
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} />

            {/* Rotas Protegidas (requerem login) */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout> 
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <Layout> 
                    <UserList />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Rota Catch-all (redireciona para Home) */}
            <Route path="*" element={<Navigate to="/" replace />} /> 
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
