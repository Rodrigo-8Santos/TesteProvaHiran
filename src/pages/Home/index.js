import React from 'react';
import { Box, Heading, Text, VStack, Button, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// No need to import Layout here, App.js handles it for this route

const Home = () => {
  const { user } = useAuth();
  const emphasisColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        as="h1"
        size="2xl"
        mb={4}
        fontWeight="bold"
      >
        Bem-vindo à Gestão CRUD
      </Heading>
      <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')} mb={6}>
        Uma aplicação simples para gerenciar usuários utilizando React e Supabase, agora com um visual renovado!
      </Text>
      <VStack spacing={4}>
        {!user ? (
          <>
            <Text>Faça login ou registre-se para começar:</Text>
            <Button 
              as={RouterLink} 
              to="/login" 
              colorScheme="blue" 
              size="lg"
            >
              Login
            </Button>
            <Button 
              as={RouterLink} 
              to="/register" 
              variant="outline" 
              size="lg"
            >
              Registrar
            </Button>
          </>
        ) : (
          <>
            <Text>Você está logado como <Text as="span" fontWeight="bold" color={emphasisColor}>{user.email}</Text>.</Text>
            <Button 
              as={RouterLink} 
              to="/users" 
              colorScheme="blue" 
              size="lg"
            >
              Ver Lista de Usuários
            </Button>
            <Button 
              as={RouterLink} 
              to="/profile" 
              variant="outline" 
              size="lg"
            >
              Ver Perfil
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default Home;
