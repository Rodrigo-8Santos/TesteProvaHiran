import React, { useState, useEffect } from 'react';
import { 
  VStack, FormControl, FormLabel, Input, Button, useToast, NumberInput, 
  NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Flex, Spacer
} from '@chakra-ui/react';
import { userService } from '../../services/users'; // Corrected import

const UserForm = ({ userToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ nome: '', email: '', idade: '' });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nome: userToEdit.nome || '',
        email: userToEdit.email || '',
        idade: userToEdit.idade !== undefined ? String(userToEdit.idade) : '',
      });
    } else {
      // Reset form if no user is being edited (though adding is removed)
      setFormData({ nome: '', email: '', idade: '' });
    }
  }, [userToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgeChange = (valueString) => {
    setFormData(prev => ({ ...prev, idade: valueString }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const ageNumber = parseInt(formData.idade, 10);
      if (isNaN(ageNumber)) {
        throw new Error("Idade deve ser um número válido.");
      }
      const dataToSave = {
        nome: formData.nome,
        // Email is likely not editable here, handled by Supabase Auth
        idade: ageNumber,
      };

      let savedUser;
      if (userToEdit) {
        // Update existing user
        savedUser = await userService.updateUser(userToEdit.id, dataToSave);
        toast({ title: "Identidade Atualizada", status: "success", duration: 3000, isClosable: true });
      } else {
        // Add new user (Functionality removed from list, kept here for potential future use)
        // savedUser = await userService.createUserProfile(dataToSave); // createUserProfile might need email/auth ID
        // toast({ title: "Identidade Criada", status: "success", duration: 3000, isClosable: true });
        throw new Error("Funcionalidade de adicionar usuário desativada.");
      }
      onSave(savedUser); // Pass updated/created user back
    } catch (err) {
      console.error("Failed to save user:", err);
      toast({ title: "Erro ao Salvar", description: err.message || "Não foi possível salvar os dados.", status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl id="nome-form" isRequired>
          <FormLabel>Nome (Identificador)</FormLabel>
          <Input 
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Nome da identidade"
          />
        </FormControl>

        <FormControl id="email-form" isReadOnly> {/* Email usually read-only in profile edit */}
          <FormLabel>Email (Ponto de Acesso)</FormLabel>
          <Input 
            name="email"
            type="email"
            value={formData.email}
            isReadOnly
            placeholder="ponto.acesso@dominio.net"
            variant="filled" // Indicate read-only
            bg="gray.800"
            cursor="default"
            borderColor="gray.700"
          />
        </FormControl>

        <FormControl id="idade-form" isRequired>
          <FormLabel>Idade (Registro)</FormLabel>
          <NumberInput 
            min={0} 
            value={formData.idade} 
            onChange={handleAgeChange}
            focusBorderColor="brand.400"
          >
            <NumberInputField placeholder="Idade registrada" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Flex mt={6} gap={3} justify="flex-end">
          <Button variant="ghost" onClick={onCancel} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            colorScheme="brand" 
            variant="solid"
            isLoading={isLoading}
            loadingText={userToEdit ? "Salvando..." : "Criando..."}
          >
            {userToEdit ? 'Salvar Alterações' : 'Criar Usuário'}
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

export default UserForm;
