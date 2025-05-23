import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Header from '../Header'; // Assuming Header is one level up
import Footer from '../Footer'; // Assuming Footer is one level up

const Layout = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  return (
    <Flex 
      direction="column" 
      minH="100vh" 
      bg={bgColor} 
      color={textColor}
    >
      <Header />
      <Box 
        as="main" // Use semantic main tag
        flex="1" 
        py={{ base: 6, md: 8 }} // Responsive padding
        px={{ base: 4, md: 6, lg: 8 }} // Responsive padding
        w="full" 
        maxW="container.xl" // Limit content width for larger screens
        mx="auto" // Center content
      >
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
