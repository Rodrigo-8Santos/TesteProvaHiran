import React, { useState } from 'react';
import { Box, Alert, AlertIcon, VStack, FormControl, FormLabel, Input, Button, Text, Link as ChakraLink, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'; // Added NumberInput components
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/AuthLayout'; // Import the new layout

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState(''); 
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState(''); // Added state for age
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
    // Validate idade - ensure it's a number and required
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
      // Pass name and age along with email and password
      const userData = { 
        nome: nome, 
        idade: ageNumber, // Pass the parsed number
        // descricao: '' // Add description if needed/available
      }; 
      const { success: registerSuccess, error: registerError } = await register(email, password, userData);

      if (registerSuccess) {
        setSuccess('Conta criada com sucesso! Você será redirecionado para o login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000); 
      } else {
        setError(registerError?.message || 'Erro ao criar conta. Verifique os dados e tente novamente.');
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Erro ao criar conta. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Criar Nova Conta">
      <Box width="100%">
        {error && (
          <Alert status="error" borderRadius="md" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        {success && (
          <Alert status="success" borderRadius="md" mb={4}>
            <AlertIcon />
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="nome" isRequired>
              <FormLabel>Nome</FormLabel>
              <Input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                focusBorderColor="blue.500"
              />
            </FormControl>

            {/* Added Age Field */}
            <FormControl id="idade" isRequired>
              <FormLabel>Idade</FormLabel>
              {/* Using NumberInput for better age input handling */}
              <NumberInput 
                min={0} 
                value={idade} 
                onChange={(valueString) => setIdade(valueString)} 
                focusBorderColor="blue.500"
              >
                <NumberInputField placeholder="Sua idade" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                focusBorderColor="blue.500"
              />
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel>Senha</FormLabel>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha segura"
                focusBorderColor="blue.500"
              />
            </FormControl>

            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirmar Senha</FormLabel>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                focusBorderColor="blue.500"
              />
            </FormControl>
            
            <Button 
              type="submit" 
              colorScheme="blue" 
              width="full" 
              mt={4}
              isLoading={isLoading}
              loadingText="Criando conta..."
              isDisabled={success} 
            >
              Registrar
            </Button>
          </VStack>
        </form>
        
        <Text mt={6} textAlign="center">
          Já tem uma conta?{' '}
          <ChakraLink as={RouterLink} to="/login" color="blue.500" fontWeight="medium">
            Faça login
          </ChakraLink>
        </Text>
      </Box>
    </AuthLayout>
  );
};

export default Register;
