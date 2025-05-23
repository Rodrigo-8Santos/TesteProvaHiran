import React from 'react';
import { Flex, Box, useColorModeValue, Image, Heading } from '@chakra-ui/react';

const AuthLayout = ({ children, title }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bg={bgColor}
      color={textColor}
      py={{ base: 6, md: 12 }} // Add some padding
      px={{ base: 4, md: 6 }}
    >
      <Box 
        maxW="md" 
        w="full" 
        bg={cardBg} 
        boxShadow={'xl'} // Enhanced shadow
        rounded={'lg'} 
        p={{ base: 6, md: 8 }} // Responsive padding
        textAlign="center" // Center title and potentially logo
      >
        {/* Optional: Add a logo here */}
        {/* <Image src="/path/to/your/logo.svg" alt="Logo" mx="auto" mb={6} /> */}
        <Heading as="h1" size="lg" mb={6} fontWeight="semibold">
          {title} {/* Dynamic title */}
        </Heading>
        {children}
      </Box>
    </Flex>
  );
};

export default AuthLayout;
