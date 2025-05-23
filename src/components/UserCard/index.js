import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, IconButton, Flex, Spacer, Avatar, Box } from '@chakra-ui/react'; // Removed useColorModeValue
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const UserCard = ({ user, onEdit, onDelete }) => {
  // Use fixed dark mode values
  const cardBg = 'gray.700'; 
  const borderColor = 'gray.600';
  const textColor = 'whiteAlpha.900';
  const secondaryTextColor = 'gray.400';
  const headingColor = 'whiteAlpha.900';

  // Handle potential missing user data gracefully
  const userName = user?.nome || 'Nome não disponível';
  const userEmail = user?.email || 'Email não disponível';

  return (
    <Card 
      borderWidth="1px" 
      borderRadius="lg" 
      borderColor={borderColor}
      bg={cardBg}
      boxShadow="md"
      overflow="hidden" 
      height="100%" 
      display="flex"
      flexDirection="column"
      color={textColor} // Set default text color for the card
    >
      <CardHeader pb={2}>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar name={userName} bg="blue.500" /* src={user.avatar_url || undefined} */ />
            <Box>
              <Heading size="sm" color={headingColor}>{userName}</Heading>
              <Text fontSize="sm" color={secondaryTextColor}>{userEmail}</Text>
            </Box>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody py={4}>
        <Text fontSize="sm">
          ID: {user?.id || 'N/A'}
        </Text>
        {/* Display age if available */}
        {user?.idade !== null && user?.idade !== undefined && (
          <Text fontSize="sm">Idade: {user.idade}</Text>
        )}
        {/* Display description if available */}
        {user?.descricao && (
           <Text fontSize="sm" mt={2}>Descrição: {user.descricao}</Text>
        )}
      </CardBody>

      <CardFooter
        justify="flex-end" 
        flexWrap="wrap"
        borderTopWidth="1px"
        borderColor={borderColor}
        pt={3} 
        pb={3} 
        px={4} 
        gap={2} 
      >
        <Button 
          size="sm" 
          variant="ghost" 
          leftIcon={<FiEdit />} 
          onClick={onEdit} 
          colorScheme="blue"
          _hover={{ bg: 'gray.600' }} // Adjust hover for dark mode
        >
          Editar
        </Button>
        <IconButton 
          size="sm"
          variant="ghost"
          colorScheme="red"
          aria-label="Excluir usuário"
          icon={<FiTrash2 />} 
          onClick={onDelete}
          _hover={{ bg: 'red.900', color: 'white' }} // Adjust hover for dark mode
        />
      </CardFooter>
    </Card>
  );
};

export default UserCard;
