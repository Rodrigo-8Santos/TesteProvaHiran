import React, { useState } from 'react';
import { Box, Alert, AlertIcon, VStack, FormControl, FormLabel, Input, Button, Text, Link as ChakraLink } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout'; // Import the new layout

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { success, error: authError } = await login(email, password);

      if (success) {
        navigate('/profile'); // Redirect to profile or user list after login
      } else {
        setError(authError?.message || 'Credenciais inválidas. Verifique seu email e senha.');
      }
    } catch (err) {
      console.error("Login error:", err); // Log the full error for debugging
      setError(err.message || 'Erro ao fazer login. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use the AuthLayout, passing the title
    <AuthLayout title="Acessar sua Conta">
      <Box width="100%"> {/* Ensure Box takes full width within AuthLayout's centered container */}
        {error && (
          <Alert status="error" borderRadius="md" mb={4}> {/* Add margin bottom */}
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                // Use focusBorderColor for better visibility in dark mode
                focusBorderColor="blue.500" 
              />
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel>Senha</FormLabel>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                focusBorderColor="blue.500"
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="blue" 
              width="full" 
              mt={4} // Add margin top
              isLoading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
            </Button>
          </VStack>
        </form>
        
        <Text mt={6} textAlign="center">
          Não tem uma conta?{' '}
          {/* Use ChakraLink for styling consistency, wrapping RouterLink */}
          <ChakraLink as={RouterLink} to="/register" color="blue.500" fontWeight="medium">
            Registre-se
          </ChakraLink>
        </Text>
      </Box>
    </AuthLayout>
  );
};

export default Login;
