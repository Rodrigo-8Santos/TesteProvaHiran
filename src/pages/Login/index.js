import React, { useState } from 'react';
import { 
  Box, VStack, FormControl, FormLabel, Input, Button, Text, Link as ChakraLink, 
  Alert, AlertIcon, Heading
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout'; // Use the themed AuthLayout

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
      const { error: loginError } = await login(email, password);
      if (loginError) {
        throw loginError;
      }
      navigate('/users'); // Redirect to user list on successful login
    } catch (err) {
      console.error("Login error:", err);
      // More thematic error message
      setError(err.message || 'Falha na autenticação // Protocolo de segurança rejeitado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="NeoCRUD // BLACKWALL PROTOCOL">
      <VStack spacing={4} align="stretch" width="100%">
        <Text textAlign="center" fontSize="sm" color="gray.400" mb={6}>
          “Você está prestes a acessar uma camada restrita do sistema. NeoCRUD opera na periferia da rede, onde o controle de dados ultrapassa os limites da segurança comum. Modifique, insira ou exclua identidades — mas lembre-se: além desta interface, a vigilância observa.”
        </Text>

        {error && (
          <Alert status="error" borderRadius="md" variant="solid" bg="red.700" color="white">
            <AlertIcon color="white" />
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              {/* Thematic Label */}
              <FormLabel fontFamily="body" fontWeight="600">Ponto de Acesso</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="interface@rede.segura" // Thematic Placeholder
              />
            </FormControl>
            
            <FormControl id="password" isRequired>
              {/* Thematic Label */}
              <FormLabel fontFamily="body" fontWeight="600">Chave de Acesso</FormLabel>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="||||||||" // Thematic Placeholder
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="brand" 
              variant="solid"
              width="full" 
              mt={4}
              isLoading={isLoading}
              loadingText="Verificando Acesso..."
            >
              Autorizar Acesso
            </Button>
          </VStack>
        </form>
        
        <Text mt={6} textAlign="center" fontSize="sm">
          {/* Thematic Text */}
          Acesso Negado?{' '}
          <ChakraLink as={RouterLink} to="/register" color="brand.400" fontWeight="600">
            Forjar Identidade
          </ChakraLink>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default Login;
