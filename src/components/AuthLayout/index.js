import React from 'react';
import { Box, Flex, Heading, Text, VStack, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion'; // For transitions

// Motion component for fade-in effect
const MotionBox = motion(Box);

const AuthLayout = ({ children, title }) => {
  // Use theme colors directly
  const bgColor = 'blackwall.background'; // #0a0a0a
  const panelBg = 'blackwall.panel'; // #121212
  const textColor = 'blackwall.text'; // #c0c0c0
  const highlightColor = 'blackwall.highlight'; // #2dd4f7

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bg={bgColor} 
      color={textColor}
      p={4}
      className="subtle-background" // Apply subtle background pattern
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        bg={panelBg}
        p={{ base: 6, md: 10 }}
        borderRadius="md"
        boxShadow={`0 0 25px rgba(45, 212, 247, 0.1), 0 0 10px rgba(117, 0, 0, 0.2)`} // Subtle glow
        borderWidth="1px"
        borderColor="gray.700"
        maxW="md"
        w="full"
      >
        <VStack spacing={6} align="stretch">
          <Heading 
            as="h1" 
            size="xl" 
            textAlign="center" 
            fontFamily="heading" // Orbitron
            fontWeight="600"
            className="glitch" // Apply glitch effect
            data-text={title} // Text for glitch effect
            mb={2} // Margin bottom for spacing
            color={highlightColor} // Use highlight color for title
          >
            {title} 
          </Heading>
          
          {/* Render children (Login or Register form) */}
          {children}
        </VStack>
      </MotionBox>
    </Flex>
  );
};

export default AuthLayout;
