import React, { useState } from 'react';
import { 
  Box, VStack, FormControl, FormLabel, Input, Button, Text, Link as ChakraLink, 
  Alert, AlertIcon, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper 
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout'; // Use the themed AuthLayout

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState(''); 
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nome) { 
      setError('O campo Nome é obrigatório.');
      return;
    }
    const ageNumber = parseInt(idade, 10);
    if (isNaN(ageNumber) || idade === '') { 
      setError('O campo Idade é obrigatório e deve ser um número.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const userData = { 
        nome: nome, 
        idade: ageNumber, 
      }; 
      const { success: registerSuccess, error: registerError } = await register(email, password, userData);

      if (registerSuccess) {
        setSuccess('Identidade forjada com sucesso! Redirecionando para autorização...');
        setTimeout(() => {
          navigate('/login');
        }, 2500); 
      } else {
        setError(registerError?.message || 'Falha ao forjar identidade. Verifique os dados.');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Erro crítico ao forjar identidade.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use AuthLayout with the same title as Login for consistency
    <AuthLayout title="NeoCRUD // BLACKWALL PROTOCOL">
      <VStack spacing={4} align="stretch" width="100%">
        {/* Optional: Add a small description specific to registration if needed */}
        {/* <Text textAlign="center" fontSize="sm" color="gray.400" mb={6}>...</Text> */}

        {error && (
          <Alert status="error" borderRadius="md" variant="solid" bg="red.700" color="white">
            <AlertIcon color="white" />
            {error}
          </Alert>
        )}
        {success && (
          <Alert status="success" borderRadius="md" variant="solid" bg="brand.600" color="blackwall.background">
            <AlertIcon color="blackwall.background" />
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="nome" isRequired>
              <FormLabel fontFamily="body" fontWeight="600">Nome (Identificador)</FormLabel>
              <Input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da nova identidade"
              />
            </FormControl>

            <FormControl id="idade" isRequired>
              <FormLabel fontFamily="body" fontWeight="600">Idade (Registro)</FormLabel>
              <NumberInput 
                min={0} 
                value={idade} 
                onChange={(valueString) => setIdade(valueString)} 
                focusBorderColor="brand.400"
              >
                <NumberInputField placeholder="Idade registrada" bg="gray.950" borderColor="gray.700" _hover={{ borderColor: 'gray.600' }} />
                <NumberInputStepper>
                  <NumberIncrementStepper borderColor="gray.700" _hover={{ bg: 'gray.800' }}/>
                  <NumberDecrementStepper borderColor="gray.700" _hover={{ bg: 'gray.800' }}/>
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel fontFamily="body" fontWeight="600">Email (Ponto de Acesso)</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ponto.acesso@dominio.net"
              />
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel fontFamily="body" fontWeight="600">Senha (Chave Mestra)</FormLabel>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie a chave de acesso"
              />
            </FormControl>

            <FormControl id="confirmPassword" isRequired>
              <FormLabel fontFamily="body" fontWeight="600">Confirmar Senha (Verificação)</FormLabel>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a chave mestra"
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="brand" // Use highlight color
              variant="solid"
              width="full" 
              mt={4}
              isLoading={isLoading}
              loadingText="Forjando Identidade..."
              isDisabled={success} 
            >
              Forjar Identidade
            </Button>
          </VStack>
        </form>
        
        <Text mt={6} textAlign="center" fontSize="sm">
          Já possui acesso?{' '}
          <ChakraLink as={RouterLink} to="/login" color="brand.400" fontWeight="600">
            Autorizar Acesso
          </ChakraLink>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default Register;
