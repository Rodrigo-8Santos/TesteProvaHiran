import React from 'react';
import { Box, Heading, Text, Flex, IconButton, Avatar, Spacer, Tooltip } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const UserCard = ({ user, onEdit, onDelete }) => {
  // Use theme colors directly
  const highlightColor = 'brand.400'; // #2dd4f7
  const dangerColor = 'red.700'; // #750000
  const panelBg = 'blackwall.panel'; // #121212
  const textColor = 'blackwall.text'; // #c0c0c0
  const subtleTextColor = 'gray.400';

  return (
    <Box 
      p={5} 
      // Use Card base style from theme (bg, border, shadow, hover)
      variant="outline" // This might not be needed if Card style is applied globally
      borderRadius="md"
      bg={panelBg} // Explicitly set for clarity or override
      borderColor="gray.700"
      borderWidth="1px"
      _hover={{ // Enhance hover from theme
        borderColor: highlightColor,
        boxShadow: `0 0 20px rgba(45, 212, 247, 0.2), 0 0 8px rgba(117, 0, 0, 0.1)`,
        transform: 'translateY(-3px)',
      }}
      transition="all 0.3s ease-out"
      position="relative" // For potential absolute elements later
      overflow="hidden" // Ensure content fits
    >
      <Flex align="center" mb={4}>
        <Avatar name={user.nome} size="md" bg="brand.600" color="white" mr={4} />
        <Box overflow="hidden"> {/* Prevent text overflow */}
          <Heading size="sm" noOfLines={1} title={user.nome}>{user.nome || 'Identidade Desconhecida'}</Heading>
          <Text fontSize="xs" color={subtleTextColor} noOfLines={1} title={user.email}>{user.email || 'Ponto de Acesso Indefinido'}</Text>
        </Box>
      </Flex>

      <Box fontSize="sm" color={textColor} mb={4}>
        <Text fontSize="xs" color={subtleTextColor}>ID: {user.id || 'N/A'}</Text>
        <Text fontSize="xs" color={subtleTextColor}>Idade: {user.idade !== undefined ? user.idade : 'N/A'}</Text>
      </Box>

      <Flex justify="flex-end" gap={2}>
        <Tooltip label="Editar Identidade" placement="top" bg="gray.600" color="white" fontSize="xs">
          <IconButton 
            aria-label="Editar usuário" 
            icon={<EditIcon />} 
            size="sm" 
            variant="ghost" 
            color={highlightColor}
            onClick={onEdit}
            _hover={{ 
              bg: 'rgba(45, 212, 247, 0.1)',
              color: 'brand.300',
              transform: 'scale(1.1)'
            }}
          />
        </Tooltip>
        <Tooltip label="Excluir Identidade" placement="top" bg="red.600" color="white" fontSize="xs">
          <IconButton 
            aria-label="Excluir usuário" 
            icon={<DeleteIcon />} 
            size="sm" 
            variant="ghost" 
            color="red.300"
            onClick={onDelete}
            _hover={{ 
              bg: 'rgba(117, 0, 0, 0.2)',
              color: 'red.200',
              transform: 'scale(1.1)'
            }}
          />
        </Tooltip>
      </Flex>
    </Box>
  );
};

export default UserCard;
