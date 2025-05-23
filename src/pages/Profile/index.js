import React, { useState, useEffect } from 'react';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { 
  Box, Heading, Text, VStack, Button, FormControl, FormLabel, Input, 
  useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogContent, AlertDialogOverlay, Spinner, Center, Flex, Avatar // Added Flex, Avatar
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/users'; // Corrected import
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations

// Motion component
const MotionBox = motion(Box);

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', idade: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const navigate = useNavigate();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      setError('');
      try {
        // Corrected: Use getUserById and handle { data, error } structure
        const { data: profileData, error: fetchError } = await userService.getUserById(user.id);
        if (fetchError) {
          console.error("Failed to fetch profile:", fetchError);
          // Handle specific errors like profile not found (though maybeSingle handles this)
          if (fetchError.message.includes("PGRST116")) { // Example check for "Not Found"
               setError('Perfil não encontrado no sistema.');
          } else {
              throw new Error('Falha ao carregar dados do perfil.');
          }
        } else if (profileData) {
          setProfile(profileData);
          setFormData({ nome: profileData.nome || '', email: profileData.email || '', idade: profileData.idade ? profileData.idade.toString() : '' }); // Ensure age is string for input
        } else {
           // This case might occur if maybeSingle returns null data without error
           setError('Perfil não encontrado no sistema.');
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || 'Falha ao carregar dados do perfil.');
        toast({ title: "Erro", description: err.message || 'Não foi possível carregar o perfil.', status: "error", duration: 5000, isClosable: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

   const handleAgeChange = (valueString) => {
    setFormData(prev => ({ ...prev, idade: valueString }));
  };

  const handleEditToggle = () => {
    if (isEditing && profile) {
      // Reset form data if canceling edit
      setFormData({ nome: profile.nome || '', email: profile.email || '', idade: profile.idade || '' });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    setError("");
    try {
      const updatedData = {
        // Only include fields that are meant to be updated
        nome: formData.nome,
        idade: parseInt(formData.idade, 10) || null, // Ensure age is a number or null
        // email is usually not updated here
        // descricao is missing from the form, but present in the service update function
        // If descricao should be editable, add it to the form state and here
      };

      // Corrected: Use updateUserProfile and handle { data, error } structure
      const { data: updatedProfileData, error: updateError } = await userService.updateUserProfile(profile.id, updatedData);

      if (updateError) {
        console.error("Failed to save profile:", updateError);
        throw new Error("Falha ao salvar alterações no perfil.");
      }

      // Update the local profile state with the potentially updated data returned from the service
      // Supabase update often returns the updated row(s)
      if (updatedProfileData && updatedProfileData.length > 0) {
         // Assuming the service returns the updated profile data in an array
         const newlyUpdatedProfile = { ...profile, ...updatedProfileData[0] }; // Merge existing with updated
         setProfile(newlyUpdatedProfile);
         // Update form data as well to reflect saved state
         setFormData({ 
             nome: newlyUpdatedProfile.nome || '', 
             email: newlyUpdatedProfile.email || '', // Keep email from profile
             idade: newlyUpdatedProfile.idade ? newlyUpdatedProfile.idade.toString() : '' 
         });
      } else {
          // If service doesn't return updated data, update locally based on formData
          const locallyUpdatedProfile = { ...profile, ...updatedData };
          setProfile(locallyUpdatedProfile);
          // formData is already up-to-date in this case
      }

      setIsEditing(false);
      toast({ title: "Perfil Atualizado", description: "Suas informações foram salvas.", status: "success", duration: 3000, isClosable: true });
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError(err.message || "Falha ao salvar alterações no perfil.");
      toast({ title: "Erro", description: err.message || "Não foi possível salvar o perfil.", status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsAlertOpen(false); // Close alert first
    if (!user) return;
    // Add loading state for deletion?
    try {
      // Corrected: Use deleteUserAccount and handle potential error
      const { error: deleteError } = await userService.deleteUserAccount(user.id);

      if (deleteError) {
        // Handle case where auth deletion might fail but profile is gone
        if (deleteError.message.includes("User not found")) { // Example check
             console.warn("User profile might be deleted, but auth deletion failed:", deleteError);
             // Proceed with logout even if auth deletion failed partially
        } else {
            throw deleteError; // Rethrow other errors
        }
      }

      // Log out the user regardless of full deletion success
      await logout();

      // Display appropriate message
      if (deleteError && deleteError.message.includes("User not found")) {
          toast({ title: "Conta Excluída (Parcialmente)", description: "Perfil removido, mas houve um problema ao remover a autenticação. Você foi desconectado.", status: "warning", duration: 5000, isClosable: true });
      } else if (deleteError) {
          // If a different error occurred during deletion but we still logged out
          toast({ title: "Erro na Exclusão", description: "Houve um erro ao excluir a conta, mas você foi desconectado.", status: "error", duration: 5000, isClosable: true });
      } else {
          toast({ title: "Conta Excluída", description: "Sua conta e dados foram removidos. Você foi desconectado.", status: "success", duration: 5000, isClosable: true });
      }

      navigate("/login"); // Redirect to login after deletion/logout
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast({ title: "Erro Crítico", description: "Falha ao tentar excluir a conta ou fazer logout.", status: "error", duration: 5000, isClosable: true });
      // Consider if logout should be attempted again in catch block
    }
  };

  if (isLoading) {
    return (
      <Center p={10}>
        <Spinner size="xl" color="brand.400" thickness='4px' speed='0.65s' emptyColor='gray.700' />
      </Center>
    );
  }

  if (error && !profile) {
    return (
      <Alert status="error" variant="solid" bg="red.700" color="white">
        <AlertIcon color="white" />
        {error}
      </Alert>
    );
  }

  if (!profile) {
    // This case might happen briefly or if fetch fails without error state set properly
    return <Text>Carregando perfil...</Text>; 
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      maxW="container.md" // Limit width for profile page
      mx="auto"
    >
      <Heading as="h2" size="lg" mb={8} fontFamily="heading" className="glitch" data-text="Perfil do Usuário">
        Perfil do Usuário
      </Heading>

      {error && (
         <Alert status="error" variant="solid" bg="red.700" color="white" mb={4}>
            <AlertIcon color="white" />
            {error}
          </Alert>
      )}

      <Box bg="blackwall.panel" p={6} borderRadius="md" borderWidth="1px" borderColor="gray.700">
        <VStack spacing={4} align="stretch">
          <Flex align="center" gap={4} mb={4}>
             <Avatar name={profile.nome} size="lg" bg="brand.600" color="white" />
             <Box>
                <Heading size="md">{profile.nome}</Heading>
                <Text color="gray.400">{profile.email}</Text>
             </Box>
          </Flex>

          <FormControl id="nome" isReadOnly={!isEditing}>
            <FormLabel>Nome</FormLabel>
            <Input 
              type="text" 
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              isReadOnly={!isEditing}
              variant={isEditing ? "outline" : "filled"}
              bg={!isEditing ? "gray.800" : undefined}
              _readOnly={{ bg: 'gray.800', cursor: 'default', borderColor: 'gray.700' }}
            />
          </FormControl>

          <FormControl id="email" isReadOnly>
            <FormLabel>Email (Ponto de Acesso)</FormLabel>
            <Input 
              type="email" 
              name="email"
              value={formData.email}
              isReadOnly // Email usually not editable
              variant="filled"
              bg="gray.800"
              cursor="default"
              borderColor="gray.700"
            />
          </FormControl>

          <FormControl id="idade" isReadOnly={!isEditing}>
            <FormLabel>Idade</FormLabel>
             <Input 
              type="number" 
              name="idade"
              value={formData.idade}
              onChange={handleInputChange} // Use standard input change for simplicity here
              isReadOnly={!isEditing}
              variant={isEditing ? "outline" : "filled"}
              bg={!isEditing ? "gray.800" : undefined}
               _readOnly={{ bg: 'gray.800', cursor: 'default', borderColor: 'gray.700' }}
            />
          </FormControl>

          <Flex justify="space-between" mt={6} direction={{ base: 'column', md: 'row' }} gap={4}>
            <Button 
              colorScheme="brand" 
              variant={isEditing ? "ghost" : "outline"}
              onClick={handleEditToggle}
            >
              {isEditing ? 'Cancelar Edição' : 'Editar Perfil'}
            </Button>
            
            {isEditing && (
              <Button 
                colorScheme="brand" 
                variant="solid"
                onClick={handleSaveProfile}
                isLoading={isSaving}
                loadingText="Salvando..."
              >
                Salvar Alterações
              </Button>
            )}

            {!isEditing && (
              <Button 
                colorScheme="red" 
                variant="solid"
                onClick={() => setIsAlertOpen(true)}
              >
                Excluir Conta
              </Button>
            )}
          </Flex>
        </VStack>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
        isCentered
      >
        <AlertDialogOverlay bg="blackAlpha.800" backdropFilter="blur(5px)">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Identidade Permanentemente?
            </AlertDialogHeader>

            <AlertDialogBody>
              Esta ação não pode ser desfeita. Todos os seus dados associados serão removidos do sistema.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)} variant="ghost">
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3} variant="solid">
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MotionBox>
  );
};

export default Profile;
