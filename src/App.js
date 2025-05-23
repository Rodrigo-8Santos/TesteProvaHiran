import React from 'react';
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

// --- Blackwall Theme Customization ---
const blackwallColors = {
  background: '#0a0a0a', // Main background
  panel: '#121212',      // Cards, Modals background
  text: '#c0c0c0',        // Primary text
  highlight: '#2dd4f7',   // Accent/Action
  danger: '#750000',       // Hover/Error/Active Shadow
};

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e0fcff',
      100: '#b3f6ff',
      200: '#86f0ff',
      300: '#59e9ff',
      400: blackwallColors.highlight, // #2dd4f7
      500: '#1ab8d9',
      600: '#0e9cb9',
      700: '#077f99',
      800: '#03637a',
      900: '#00475b',
    },
    red: {
      50: '#ffe5e5',
      100: '#ffb8b8',
      200: '#ff8a8a',
      300: '#ff5c5c',
      400: '#ff2e2e',
      500: '#e61414',
      600: '#b30000',
      700: blackwallColors.danger, // #750000
      800: '#520000',
      900: '#330000',
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
      950: blackwallColors.panel, // #121212
      1000: blackwallColors.background, // #0a0a0a
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
        overflowX: 'hidden', // Prevent horizontal scroll potentially caused by glitch
      },
      a: {
        color: 'brand.400',
        _hover: {
          textDecoration: 'none', // Remove underline for cyberpunk style
          color: 'brand.300',
          filter: `drop-shadow(0 0 5px ${blackwallColors.highlight})`, // Subtle glow on link hover
        },
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'blackwall.panel',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'brand.700', // Darker thumb
        borderRadius: '0px', // Sharp edges
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
        borderRadius: 'sm', // Slightly sharper edges
        transition: 'all 0.3s ease-out',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'red' ? 'red.700' : 'brand.400',
          color: props.colorScheme === 'red' ? 'white' : 'blackwall.background',
          _hover: {
            bg: props.colorScheme === 'red' ? 'red.600' : 'brand.300',
            transform: 'translateY(-2px)',
            boxShadow: `0 0 15px ${props.colorScheme === 'red' ? blackwallColors.danger : blackwallColors.highlight}, 0 0 5px ${props.colorScheme === 'red' ? blackwallColors.danger : blackwallColors.highlight} inset`,
          },
          _active: {
            bg: props.colorScheme === 'red' ? 'red.800' : 'brand.500',
            transform: 'translateY(0px)',
            boxShadow: `0 0 5px ${props.colorScheme === 'red' ? blackwallColors.danger : blackwallColors.highlight}, 0 0 2px ${props.colorScheme === 'red' ? blackwallColors.danger : blackwallColors.highlight} inset`,
          }
        }),
        outline: (props) => ({
          borderWidth: '2px', // Thicker border
          borderColor: props.colorScheme === 'red' ? 'red.700' : 'brand.400',
          color: props.colorScheme === 'red' ? 'red.300' : 'brand.400',
          _hover: {
            bg: 'transparent',
            borderColor: props.colorScheme === 'red' ? 'red.500' : 'brand.300',
            color: props.colorScheme === 'red' ? 'red.200' : 'brand.300',
            transform: 'translateY(-2px)',
            boxShadow: `0 0 15px ${props.colorScheme === 'red' ? blackwallColors.danger : blackwallColors.highlight}`,
          },
           _active: {
            bg: props.colorScheme === 'red' ? 'rgba(117, 0, 0, 0.2)' : 'rgba(45, 212, 247, 0.1)',
            transform: 'translateY(0px)',
            boxShadow: `0 0 5px ${props.colorScheme === 'red' ? blackwallColors.danger : blackwallColors.highlight}`,
          },
        }),
        ghost: (props) => ({
           color: 'brand.400',
           _hover: {
             bg: 'rgba(45, 212, 247, 0.05)', // More subtle background
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
        focusBorderColor: 'brand.400',
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
              color: 'gray.600', // Darker placeholder
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
              color: 'gray.600',
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
          borderColor: 'gray.800', // Darker border
          borderRadius: 'md',
          color: 'blackwall.text',
          boxShadow: `0 0 10px rgba(18, 18, 18, 0.5)`,
          transition: 'all 0.3s ease-out',
          _hover: {
             borderColor: 'brand.700',
             boxShadow: `0 0 15px rgba(45, 212, 247, 0.15), 0 0 5px rgba(117, 0, 0, 0.1)`,
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
           borderColor: 'brand.700',
           borderRadius: 'md',
           boxShadow: `0 0 25px rgba(45, 212, 247, 0.2), 0 0 10px rgba(117, 0, 0, 0.3)`,
         },
         header: {
           fontFamily: 'heading',
           color: 'brand.400',
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
             bg: 'rgba(45, 212, 247, 0.1)',
             color: 'brand.300',
           }
         }
       }
    },
    Heading: {
      baseStyle: {
        fontFamily: 'heading', // Orbitron by default
        fontWeight: '600',
      }
    },
    Text: {
      baseStyle: {
        fontFamily: 'body', // Rajdhani by default
      }
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: 'sm',
        }
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
        <Spinner size="xl" color="brand.400" thickness='4px' speed='0.65s' emptyColor='gray.700' />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
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
