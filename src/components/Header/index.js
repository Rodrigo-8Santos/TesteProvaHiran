import React from 'react';
import { Box, Flex, Heading, Spacer, Button, Link as ChakraLink } from '@chakra-ui/react'; // Removed useColorModeValue
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Use dark mode values directly
  const bgColor = 'gray.800'; 
  const borderColor = 'gray.700';
  const linkColor = 'blue.300'; 
  const textColor = 'whiteAlpha.900';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      py={3} 
      px={{ base: 4, md: 6, lg: 8 }} 
      boxShadow="sm" 
      borderBottomWidth="1px"
      borderColor={borderColor}
      color={textColor}
    >
      <Flex align="center" maxW="container.xl" mx="auto">
        <Heading as={RouterLink} to={user ? "/users" : "/"} size="md" fontWeight="bold" color={linkColor}>
          Gestão CRUD
        </Heading>
        <Spacer />
        <Flex align="center" gap={3}> 
          {/* Links for Logged-in Users */}
          {user && (
            <>
              <Button 
                as={RouterLink} 
                to="/users"
                size="sm" 
                variant="ghost" 
                color={textColor}
                _hover={{ bg: 'gray.700' }}
              >
                Usuários
              </Button>
              <Button 
                as={RouterLink} 
                to="/profile"
                size="sm" 
                variant="ghost" 
                color={textColor}
                _hover={{ bg: 'gray.700' }}
              >
                Perfil
              </Button>
              <Button 
                size="sm" 
                colorScheme="red" 
                variant="outline" 
                onClick={handleLogout}
              >
                Sair
              </Button>
            </>
          )}
          {/* Links for Logged-out Users */}
          {!user && (
            <>
              <Button 
                as={RouterLink} 
                to="/login"
                size="sm" 
                variant="ghost" 
                color={textColor}
                _hover={{ bg: 'gray.700' }}
              >
                Login
              </Button>
              <Button 
                as={RouterLink} 
                to="/register"
                size="sm" 
                colorScheme="blue" // Make register button stand out
                variant="solid"
              >
                Registrar
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
