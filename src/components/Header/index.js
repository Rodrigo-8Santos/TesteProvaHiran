import React from 'react';
import { Box, Flex, Heading, Spacer, Button, Link as ChakraLink, Image } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import newLogo from '../../nolight_logo.jpg'; // Import the new logo

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Use theme colors directly (defined in App.js)
  const bgColor = 'blackwall.background'; // #0a0a0a
  const borderColor = 'gray.700'; // Use a dark border
  const linkColor = 'brand.400'; // Highlight color #2dd4f7
  const textColor = 'blackwall.text'; // #c0c0c0

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
      borderBottomWidth="1px"
      borderColor={borderColor} // Use a subtle border
      boxShadow={`0 1px 3px 0 rgba(255, 7, 58, 0.1), 0 1px 2px 0 rgba(117, 0, 0, 0.06)`} // Red glow effect
      color={textColor}
      position="sticky" // Make header sticky if desired
      top={0}
      zIndex="sticky"
    >
      <Flex align="center" maxW="container.xl" mx="auto">
        {/* Replace Heading with Image Logo */}
        <ChakraLink as={RouterLink} to={user ? "/users" : "/"} _hover={{ textDecoration: 'none' }}>
          <Image src={newLogo} alt="NoLight Protocol Logo" height="40px" />
        </ChakraLink>
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
                // color={textColor} // Inherited
                // _hover defined in theme
              >
                Usuários
              </Button>
              <Button
                as={RouterLink}
                to="/profile"
                size="sm"
                variant="ghost"
                // color={textColor} // Inherited
                // _hover defined in theme
              >
                Perfil
              </Button>
              <Button
                size="sm"
                colorScheme="red" // Uses custom red theme
                variant="outline"
                onClick={handleLogout}
                // Hover defined in theme
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
                // color={textColor} // Inherited
                // _hover defined in theme
              >
                Autorizar Acesso
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                size="sm"
                colorScheme="brand" // Use highlight color
                variant="solid"
                // Hover defined in theme
              >
                Forjar Identidade
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
