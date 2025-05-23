import React, { useEffect } from 'react';
import { ChakraProvider, extendTheme, Spinner, Center } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import Layout from './components/Layout';
// AuthLayout is used internally by Login and Register pages

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserList from './pages/UserList';

// --- Blackwall Theme Customization (Red Dominant) ---
const blackwallColors = {
  background: '#050505', // Even darker background
  panel: '#101010',      // Slightly darker panels
  text: '#b0b0b0',        // Slightly dimmer text for contrast with red
  highlight: '#ff073a',   // Intense Neon Red (was cyan #2dd4f7)
  danger: '#ff073a',       // Use the same intense red for danger/errors
  subtleRed: '#750000',   // Darker red for shadows/background elements
  cyanDetail: '#2dd4f7',  // Keep cyan for very specific, minimal details if needed
};

const theme = extendTheme({
  colors: {
    // BRAND IS NOW RED
    brand: {
      50: '#ffe5ea',
      100: '#ffb8c5',
      200: '#ff8aa0',
      300: '#ff5c7a',
      400: blackwallColors.highlight, // #ff073a
      500: '#e60030',
      600: '#b30026',
      700: '#80001b',
      800: '#500011',
      900: '#33000a',
    },
    // Keep red scale, but danger color uses highlight now
    red: {
      50: '#ffe5ea',
      100: '#ffb8c5',
      200: '#ff8aa0',
      300: '#ff5c7a',
      400: blackwallColors.highlight, // #ff073a
      500: '#e60030',
      600: '#b30026',
      700: blackwallColors.highlight, // Use highlight red for errors too
      800: '#500011',
      900: '#33000a',
    },
    // Keep cyan scale for potential minimal details
    cyan: {
      50: '#e0fcff',
      100: '#b3f6ff',
      200: '#86f0ff',
      300: '#59e9ff',
      400: blackwallColors.cyanDetail, // #2dd4f7
      500: '#1ab8d9',
      600: '#0e9cb9',
      700: '#077f99',
      800: '#03637a',
      900: '#00475b',
    },
    gray: {
      50: '#f7f7f7',
      100: '#e3e3e3',
      200: '#cccccc',
      300: '#b5b5b5',
      400: '#9e9e9e',
      500: '#878787',
      600: '#6f6f6f',
      700: '#585858',
      800: '#414141',
      900: '#2a2a2a',
      950: blackwallColors.panel, // #101010
      1000: blackwallColors.background, // #050505
    },
    blackwall: blackwallColors,
  },
  fonts: {
    heading: `'Orbitron', sans-serif`,
    body: `'Rajdhani', sans-serif`,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: 'blackwall.background',
        color: 'blackwall.text',
        lineHeight: 'tall',
        overflowX: 'hidden',
      },
      a: {
        color: 'brand.400', // Red links
        _hover: {
          textDecoration: 'none',
          color: 'brand.300',
          filter: `drop-shadow(0 0 8px ${blackwallColors.highlight})`, // Red glow
        },
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'blackwall.panel',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'brand.700', // Darker red thumb
        borderRadius: '0px',
        border: `1px solid ${blackwallColors.highlight}`,
        _hover: {
          background: 'brand.500',
        }
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: '600',
        borderRadius: 'sm',
        transition: 'all 0.3s ease-out',
      },
      variants: {
        solid: (props) => ({
          // Default solid is now red (brand)
          bg: props.colorScheme === 'red' ? 'red.400' : 'brand.400',
          color: props.colorScheme === 'red' ? 'white' : 'blackwall.background',
          _hover: {
            bg: props.colorScheme === 'red' ? 'red.300' : 'brand.300',
            transform: 'translateY(-2px)',
            // Use highlight (red) for both brand and red schemes now
            boxShadow: `0 0 15px ${blackwallColors.highlight}, 0 0 5px ${blackwallColors.highlight} inset`,
          },
          _active: {
            bg: props.colorScheme === 'red' ? 'red.500' : 'brand.500',
            transform: 'translateY(0px)',
            boxShadow: `0 0 5px ${blackwallColors.highlight}, 0 0 2px ${blackwallColors.highlight} inset`,
          }
        }),
        outline: (props) => ({
          borderWidth: '2px',
          // Default outline is now red (brand)
          borderColor: props.colorScheme === 'red' ? 'red.400' : 'brand.400',
          color: props.colorScheme === 'red' ? 'red.300' : 'brand.400',
          _hover: {
            bg: 'transparent',
            borderColor: props.colorScheme === 'red' ? 'red.300' : 'brand.300',
            color: props.colorScheme === 'red' ? 'red.200' : 'brand.300',
            transform: 'translateY(-2px)',
            boxShadow: `0 0 15px ${blackwallColors.highlight}`,
          },
           _active: {
            // Use highlight (red) for both brand and red schemes now
            bg: 'rgba(255, 7, 58, 0.1)', // Red transparent background
            transform: 'translateY(0px)',
            boxShadow: `0 0 5px ${blackwallColors.highlight}`,
          },
        }),
        ghost: (props) => ({
           color: 'brand.400', // Red ghost button
           _hover: {
             bg: 'rgba(255, 7, 58, 0.05)', // Red subtle background
             color: 'brand.300',
             textShadow: `0 0 8px ${blackwallColors.highlight}`,
           }
        }),
      },
    },
    Input: {
      baseStyle: {
        field: {
          fontFamily: 'body',
        }
      },
      defaultProps: {
        focusBorderColor: 'brand.400', // Red focus border
      },
      variants: {
        outline: {
          field: {
            bg: 'gray.950',
            borderColor: 'gray.700',
            color: 'blackwall.text',
            borderRadius: 'sm',
            _hover: {
              borderColor: 'gray.600',
            },
            _placeholder: {
              color: 'gray.500',
              fontStyle: 'italic',
            }
          }
        }
      }
    },
    NumberInput: { // Ensure NumberInput matches Input style
       variants: {
        outline: {
          field: {
            bg: 'gray.950',
            borderColor: 'gray.700',
            color: 'blackwall.text',
            borderRadius: 'sm',
            _hover: {
              borderColor: 'gray.600',
            },
            _placeholder: {
              color: 'gray.500', // Adjusted for better contrast
              fontStyle: 'italic',
            }
          }
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'blackwall.panel',
          borderWidth: '1px',
          borderColor: 'gray.800',
          borderRadius: 'md',
          color: 'blackwall.text',
          boxShadow: `0 0 10px rgba(18, 18, 18, 0.5)`,
          transition: 'all 0.3s ease-out',
          _hover: {
             borderColor: 'brand.700', // Dark red border on hover
             // Red glow on hover
             boxShadow: `0 0 15px rgba(255, 7, 58, 0.15), 0 0 5px rgba(117, 0, 0, 0.1)`,
          }
        }
      }
    },
    Modal: {
       baseStyle: {
         dialog: {
           bg: 'blackwall.panel',
           color: 'blackwall.text',
           borderWidth: '1px',
           borderColor: 'brand.700', // Dark red border
           borderRadius: 'md',
           // Red glow for modal
           boxShadow: `0 0 25px rgba(255, 7, 58, 0.2), 0 0 10px rgba(117, 0, 0, 0.3)`,
         },
         header: {
           fontFamily: 'heading',
           color: 'brand.400', // Red header text
           borderBottomWidth: '1px',
           borderColor: 'gray.700',
           py: 3, 
           px: 6,
         },
         body: {
           py: 6,
           px: 6,
         },
         footer: {
           borderTopWidth: '1px',
           borderColor: 'gray.700',
           py: 3,
           px: 6,
         },
         closeButton: {
           top: 3,
           right: 4,
           color: 'gray.500',
           _hover: { 
             bg: 'rgba(255, 7, 58, 0.1)', // Red subtle background
             color: 'brand.300',
           }
         }
       }
    },
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: '600',
      }
    },
    Text: {
      baseStyle: {
        fontFamily: 'body',
      }
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'sm',
        }
      },
      // Make sure Alert uses the red theme correctly
      variants: {
        subtle: (props) => {
          const { colorScheme: c } = props
          if (c !== 'red') return {}
          return {
            container: {
              bg: `red.900`, // Dark red background
              color: `red.100` // Light red text
            }
          }
        },
        solid: (props) => {
           const { colorScheme: c } = props
           if (c !== 'red') return {}
           return {
             container: {
               bg: `red.400`, // Highlight red background
               color: `white` // White text
             }
           }
        }
      }
    },
    Spinner: {
      baseStyle: {
        color: 'brand.400', // Red spinner
      }
    }
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

// Componente auxiliar para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center bg="blackwall.background" h="100vh">
        {/* Spinner color is now handled by theme */}
        <Spinner size="xl" thickness='4px' speed='0.65s' emptyColor='gray.700' />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    document.title = "NoLight Protocol";
  }, []); // Executa apenas uma vez na montagem

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota Home pública (dentro do Layout padrão) */}
            <Route 
              path="/" 
              element={
                <Layout>
                  <Home />
                </Layout>
              } 
            />
            
            {/* Rotas de Autenticação (usam AuthLayout internamente) */}
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} />

            {/* Rotas Protegidas (requerem login) */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout> 
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <Layout> 
                    <UserList />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Rota Catch-all (redireciona para Home) */}
            <Route path="*" element={<Navigate to="/" replace />} /> 
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
