import React from 'react';
import { Box, Text, useColorModeValue, Container, Link as ChakraLink } from '@chakra-ui/react';

const Footer = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box 
      as="footer" 
      bg={bgColor} 
      color={textColor} 
      py={4} 
      px={{ base: 4, md: 6, lg: 8 }} 
      mt={8} // Add margin top to separate from content
      borderTopWidth="1px"
      borderColor={borderColor}
    >
      <Container maxW="container.xl">
        <Text textAlign="center" fontSize="sm">
          © {new Date().getFullYear()} Gestão CRUD. Desenvolvido com React e Supabase.
          {/* Optional: Add a link or your name */}
          {/* {' | '} 
          <ChakraLink href="https://your-website.com" isExternal color="blue.500">
            Seu Nome/Empresa
          </ChakraLink> */}
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
