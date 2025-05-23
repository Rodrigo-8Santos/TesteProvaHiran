import React, { useState, useEffect } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { 
  Box, Heading, SimpleGrid, Input, InputGroup, InputLeftElement, 
  Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, 
  ModalCloseButton, ModalBody, ModalFooter, Text, VStack, useToast, Center, Spinner, Flex, Spacer // Added Flex, Spacer
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons'; // Using Chakra icons
import UserCard from '../../components/UserCard';
import UserForm from '../../components/UserForm';
import { userService } from '../../services/users'; // Corrected import
import { motion } from 'framer-motion'; // For list animations

// Motion component for list items
const MotionBox = motion(Box);

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  // Removed Add User modal state as functionality was removed
  const toast = useToast();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await userService.getUsers();
        setUsers(data || []);
        setFilteredUsers(data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError('Falha ao carregar usuários da rede.');
        toast({ title: "Erro", description: 'Não foi possível carregar os usuários.', status: "error", duration: 5000, isClosable: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  // Filter users based on search term
  useEffect(() => {
    const results = users.filter(user =>
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  // Handle user edit
  const handleEdit = (user) => {
    setSelectedUser(user);
    onEditOpen();
  };

  // Handle user delete
  const handleDelete = async (userId) => {
    // Confirmation dialog could be added here
    try {
      await userService.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      toast({ title: "Usuário Excluído", description: "Identidade removida do sistema.", status: "success", duration: 3000, isClosable: true });
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast({ title: "Erro", description: "Falha ao excluir identidade.", status: "error", duration: 5000, isClosable: true });
    }
  };

  // Handle save from UserForm (for editing)
  const handleSaveUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    onEditClose(); // Close edit modal
    toast({ title: "Usuário Atualizado", description: "Dados da identidade modificados.", status: "info", duration: 3000, isClosable: true });
  };

  return (
    <Box>
      <Flex mb={8} alignItems="center">
        <Heading as="h2" size="lg" fontFamily="heading" className="glitch" data-text="Usuários Registrados">
          Usuários Registrados
        </Heading>
        <Spacer />
        {/* Add User button removed as requested */}
      </Flex>

      <InputGroup mb={8} maxW="lg">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.500" />
        </InputLeftElement>
        <Input 
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // Style inherited from theme
        />
      </InputGroup>

      {isLoading && (
        <Center p={10}>
          <Spinner size="xl" color="brand.400" thickness='4px' speed='0.65s' emptyColor='gray.700' />
        </Center>
      )}

      {error && (
         <Alert status="error" variant="solid" bg="red.700" color="white">
            <AlertIcon color="white" />
            {error}
          </Alert>
      )}

      {!isLoading && !error && (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredUsers.map((user, index) => (
            <MotionBox
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }} // Staggered animation
            >
              <UserCard 
                user={user} 
                onEdit={() => handleEdit(user)} 
                onDelete={() => handleDelete(user.id)} 
              />
            </MotionBox>
          ))}
        </SimpleGrid>
      )}

      {!isLoading && !error && filteredUsers.length === 0 && (
        <Text textAlign="center" color="gray.500" mt={10}>Nenhuma identidade encontrada com os critérios atuais.</Text>
      )}

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(5px)"/>
        <ModalContent> 
          <ModalHeader>Editar Identidade</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedUser && (
              <UserForm 
                userToEdit={selectedUser} 
                onSave={handleSaveUser} 
                onCancel={onEditClose} 
              />
            )}
          </ModalBody>
          {/* Footer removed as buttons are inside UserForm */}
        </ModalContent>
      </Modal>

      {/* Add User Modal Removed */}

    </Box>
  );
};

export default UserList;
