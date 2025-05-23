import React, { useState } from 'react'; 
import {
  Box, Heading, Text, VStack, Avatar, Spinner, Center, Alert, AlertIcon, Button,
  useDisclosure, 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Flex // Flex import is kept
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Removed Layout import from here

const Profile = () => {
  const { user, profile, loading, error: authError, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  // Use dark mode values directly
  const cardBg = 'gray.700'; 
  const borderColor = 'gray.600'; 
  const textColor = 'whiteAlpha.900';
  const headingColor = 'whiteAlpha.900';
  const secondaryTextColor = 'gray.400';

  // State and controls for delete confirmation modal
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    setIsDeleting(true);
    try {
      const { success, error } = await deleteAccount();
      if (success) {
        navigate('/login'); 
      } else {
        console.error('Delete account failed:', error);
        onDeleteClose(); 
      }
    } catch (error) {
      console.error('Delete account failed:', error);
      onDeleteClose();
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state handled within the Layout in App.js now
  // if (loading) { ... }

  // Auth check also handled by ProtectedRoute in App.js
  // if (authError || !user) { ... }

  // Assume user and profile are available due to ProtectedRoute
  const displayEmail = user?.email || 'N/A';
  const displayName = profile?.nome || user?.user_metadata?.nome || 'Nome não definido';
  const displayAge = profile?.idade !== null && profile?.idade !== undefined ? profile.idade : 'Idade não definida';
  const displayDescription = profile?.descricao || 'Sem descrição';

  // Removed the Layout wrapper from the return statement
  return (
    <Box>
      <Heading as="h1" size="xl" mb={6} color={headingColor}>
        Meu Perfil
      </Heading>

      {authError && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {authError.message || 'Ocorreu um erro na autenticação.'}
        </Alert>
      )}

      <Box 
        bg={cardBg} 
        p={{ base: 4, md: 6 }} 
        borderRadius="lg" 
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="md"
        color={textColor}
      >
        <VStack spacing={5} align="start"> 
          <Avatar 
            size="xl" 
            name={displayName} 
            mb={4}
            bg="blue.500" 
          />
          <Box>
            <Heading as="h2" size="md" mb={1} color={headingColor}>Nome:</Heading>
            <Text fontSize="lg">{displayName}</Text>
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={1} color={headingColor}>Email:</Heading>
            <Text fontSize="lg">{displayEmail}</Text>
          </Box>
           <Box>
            <Heading as="h2" size="md" mb={1} color={headingColor}>Idade:</Heading>
            <Text fontSize="lg">{displayAge}</Text>
          </Box>
           <Box>
            <Heading as="h2" size="md" mb={1} color={headingColor}>Descrição:</Heading>
            <Text fontSize="lg">{displayDescription}</Text>
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={1} color={headingColor}>ID do Usuário:</Heading>
            <Text fontSize="sm" color={secondaryTextColor}>{user?.id || 'N/A'}</Text> 
          </Box>
          
          {/* Action Buttons */}
          <Flex direction={{ base: 'column', sm: 'row' }} gap={3} mt={6} w="full"> 
            <Button 
              colorScheme="red" 
              variant="solid" 
              onClick={handleLogout}
              flex={{ base: '1', sm: 'auto' }} 
            >
              Sair (Logout)
            </Button>
            <Button 
              colorScheme="red" 
              variant="outline" 
              onClick={onDeleteOpen} 
              flex={{ base: '1', sm: 'auto' }}
            >
              Excluir Conta
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Delete Account Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.700" color="whiteAlpha.900">
          <ModalHeader>Confirmar Exclusão de Conta</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Tem certeza que deseja excluir sua conta permanentemente? Esta ação não pode ser desfeita.</Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onDeleteClose} _hover={{ bg: 'gray.600' }}>
              Cancelar
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleDeleteAccountConfirm} 
              isLoading={isDeleting}
              loadingText="Excluindo..."
            >
              Excluir Conta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile;
