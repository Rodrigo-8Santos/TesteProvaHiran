import React, { useState, useEffect } from 'react';
import { 
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, 
  Button, FormControl, FormLabel, Input, VStack, useToast, Alert, AlertIcon, Text // Added Text here
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// Import the default export userService
import userService from '../../services/users'; 

// Validation Schema using Yup
const validationSchema = Yup.object({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  // Add other fields as necessary, e.g., password for creation
  // password: Yup.string().when('isEditing', {
  //   is: false,
  //   then: Yup.string().required('Senha é obrigatória'),
  //   otherwise: Yup.string(),
  // }),
});

const UserForm = ({ isOpen, onClose, currentUser, onSuccess }) => {
  const toast = useToast();
  const [error, setError] = useState('');
  const isEditing = Boolean(currentUser);

  const formik = useFormik({
    initialValues: {
      nome: '',
      email: '',
      // Add other fields here
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setError('');
      setSubmitting(true);
      try {
        let resultData; // Variable to hold the user data from the response
        if (isEditing) {
          // Call userService.updateUserProfile
          const { data, error: updateError } = await userService.updateUserProfile(currentUser.id, values);
          if (updateError) throw updateError;
          // Assuming the update function might not return the full user, 
          // we merge the updated values with the existing currentUser for the callback
          resultData = { ...currentUser, ...values }; 
        } else {
          // Call userService.createUserProfile
          // We need the user ID from Auth context for this, which isn't directly available here.
          // Assuming the createUserProfile in the service handles ID association or is adjusted.
          // For now, let's assume the service function is adapted or we pass necessary info.
          // *** This might need adjustment based on how createUserProfile expects data ***
          // Let's assume it expects 'nome' and 'email' and returns the created user with ID.
          const { data, error: createError } = await userService.createUserProfile(values); 
          if (createError) throw createError;
          // Assuming 'data' contains the newly created user object from the database
          resultData = data && data.length > 0 ? data[0] : values; // Use returned data if available
        }
        
        toast({
          title: `Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onSuccess(resultData); // Pass the result back
        resetForm();
        onClose(); // Close modal on success

      } catch (err) {
        console.error("Form submission error:", err);
        setError(err.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário. Tente novamente.`);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true, // Reinitialize form when currentUser changes
  });

  // Effect to set form values when editing
  useEffect(() => {
    if (isEditing && currentUser) {
      formik.setValues({
        nome: currentUser.nome || '',
        email: currentUser.email || '',
        // Set other fields from currentUser
      });
    } else {
      formik.resetForm(); // Reset form if adding or currentUser is null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isEditing]); // Rerun when currentUser or isEditing changes

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent mx={{ base: 4, md: 0 }}> {/* Add horizontal margin on mobile */}
        <ModalHeader>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={formik.handleSubmit}>
          <ModalBody pb={6}>
            {error && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <VStack spacing={4}>
              <FormControl id="nome" isRequired isInvalid={formik.touched.nome && Boolean(formik.errors.nome)}>
                <FormLabel>Nome</FormLabel>
                <Input 
                  name="nome"
                  value={formik.values.nome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Nome completo"
                  focusBorderColor="blue.500"
                />
                {formik.touched.nome && formik.errors.nome && (
                  <Text color="red.500" fontSize="sm">{formik.errors.nome}</Text> // Text is now imported
                )}
              </FormControl>

              <FormControl id="email" isRequired isInvalid={formik.touched.email && Boolean(formik.errors.email)}>
                <FormLabel>Email</FormLabel>
                <Input 
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="email@exemplo.com"
                  focusBorderColor="blue.500"
                />
                {formik.touched.email && formik.errors.email && (
                  <Text color="red.500" fontSize="sm">{formik.errors.email}</Text> // Text is now imported
                )}
              </FormControl>

              {/* Add other form fields here following the same pattern */}
              
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="ghost">Cancelar</Button>
            <Button 
              colorScheme="blue" 
              type="submit" 
              isLoading={formik.isSubmitting}
              loadingText={isEditing ? 'Salvando...' : 'Criando...'}
            >
              {isEditing ? 'Salvar Alterações' : 'Criar Usuário'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UserForm;
