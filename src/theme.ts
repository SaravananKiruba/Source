import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
  },
  styles: {
    global: {
      'html, body': {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: 'white',
          color: 'gray.800',
        },
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.800',
      },
    },
    Heading: {
      baseStyle: {
        color: 'gray.800',
      },
    },
    FormLabel: {
      baseStyle: {
        color: 'gray.700',
        fontWeight: 'medium',
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'gray.300',
            color: 'gray.800',
            _placeholder: {
              color: 'gray.400',
            },
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'blue.500',
              boxShadow: '0 0 0 1px #3182ce',
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'white',
            borderColor: 'gray.300',
            color: 'gray.800',
            _hover: {
              borderColor: 'gray.400',
            },
            _focus: {
              borderColor: 'blue.500',
              boxShadow: '0 0 0 1px #3182ce',
            },
          },
        },
      },
    },
    Stat: {
      baseStyle: {
        label: {
          color: 'gray.600',
        },
        number: {
          color: 'gray.800',
        },
        helpText: {
          color: 'gray.500',
        },
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            color: 'gray.700',
            fontWeight: 'semibold',
          },
          td: {
            color: 'gray.800',
          },
        },
      },
    },
  },
});

export default theme;
