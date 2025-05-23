import React from 'react';
import { Box, Container, Flex } from '@chakra-ui/react';
import Header from '../Header'; // Assuming Header is updated/will be updated
import Footer from '../Footer'; // Assuming Footer is updated/will be updated
import { motion } from 'framer-motion'; // For page transitions

// Motion component for fade-in effect
const MotionContainer = motion(Container);

const Layout = ({ children }) => {
  // Use theme colors directly
  const bgColor = 'blackwall.background'; // #0a0a0a
  const textColor = 'blackwall.text'; // #c0c0c0

  return (
    <Flex direction="column" minH="100vh" bg={bgColor} color={textColor} className="subtle-background">
      <Header />
      <MotionContainer 
        as="main" 
        maxW="container.xl" 
        py={{ base: 6, md: 8 }} 
        px={{ base: 4, md: 6 }} 
        flex="1"
        // Apply fade-in transition to main content area
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </MotionContainer>
      <Footer />
    </Flex>
  );
};

export default Layout;
