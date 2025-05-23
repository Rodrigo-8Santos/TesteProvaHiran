import React, { useState, useEffect } from 'react';
import { 
  Box, Heading, SimpleGrid, Button, useDisclosure, Spinner, Center, Alert, AlertIcon, 
  Input, InputGroup, InputLeftElement, Icon, Flex, Text 
} from '@chakra-ui/react';
// Removed FiPlus import as the Add button is removed
import { FiSearch } from 'react-icons/fi'; 
import { useNavigate } from 'react-router-dom';
import userService from '../../services/users'; 
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout'; 
import UserCard from '../../components/UserCard'; 
import UserForm from '../../components/UserForm'; // Keep UserForm for editing

const UserList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // Keep disclosure controls for the Edit modal
  const { isOpen, onOpen, onClose } = useDisclosure(); 
  const [currentUser, setCurrentUser] = useState(null); // For editing

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) {
        navigate('/login'); 
        return;
      }
      setLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await userService.getAllUsers();
        if (fetchError) throw fetchError;
        setUsers(data || []);
        setFilteredUsers(data || []); 
      } catch (err) {
        console.error("Error fetching users:", err);
        setError('Falha ao carregar usuários. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(u => 
          u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  // Removed handleAddUser function

  const handleEditUser = (userToEdit) => {
    setCurrentUser(userToEdit);
    onOpen(); // Open modal with user data for editing
  };

  const handleDeleteUser = async (userId) => {
    // Keep delete functionality as is
    if (window.confirm('Tem certeza que deseja excluir este usuário? A ação não pode ser desfeita.')) {
      try {
        const { error: deleteError } = await userService.deleteUserAccount(userId);
        if (deleteError) throw deleteError;
        
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } catch (err) {
        console.error("Error deleting user:", err);
        setError('Falha ao excluir usuário.');
      }
    }
  };

  // Callback for when the edit form is successfully submitted
  const handleFormSuccess = (updatedUser) => {
    // Only handle editing case now
    const updatedList = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedList);
    setFilteredUsers(updatedList);
    onClose(); // Close modal
  };

  // Check for duplicated Header: Ensure Layout is applied ONLY in App.js for this route
  // This component should NOT render Layout itself.

  return (
    // Removed Layout wrapper from here, assuming it's applied in App.js
    <Box>
      <Heading as="h1" size="xl" mb={6}>
        Lista de Usuários
      </Heading>

      {error && (
        <Alert status="error" mb={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {/* Search Bar Row - Removed Add Button */}
      <Flex 
        mb={6} 
        direction={{ base: 'column', md: 'row' }} 
        align={{ md: 'center' }} 
        // Justify content to start as there's only one item now
        justify="flex-start" 
        gap={4} 
      >
        <InputGroup maxW={{ base: 'full', md: 'sm' }}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input 
            placeholder="Buscar por nome ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            focusBorderColor="blue.500"
            bg="gray.700" // Ensure input background matches dark theme
          />
        </InputGroup>
        {/* Removed the Add User Button */}
      </Flex>

      {loading ? (
        <Center py={10}>
          <Spinner size="xl" color="blue.300" />
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <UserCard 
                key={u.id} 
                user={u} 
                onEdit={() => handleEditUser(u)} 
                onDelete={() => handleDeleteUser(u.id)} 
              />
            ))
          ) : (
            <Text>Nenhum usuário encontrado.</Text> 
          )}
        </SimpleGrid>
      )}

      {/* Modal for Editing User (isOpen is controlled by handleEditUser) */}
      {currentUser && (
        <UserForm 
          isOpen={isOpen} 
          onClose={onClose} 
          currentUser={currentUser} 
          onSuccess={handleFormSuccess} 
        />
      )}
    </Box>
  );
};

export default UserList;
