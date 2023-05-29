import { extendTheme } from "@chakra-ui/react";

export const appTheme = extendTheme({
  styles: {
    // pass in settings object
    global: (props) => ({
      'html, body': {
        fontSize: 'sm',
        color: props.colorMode === 'dark' ? 'white' : 'gray.600',
        lineHeight: 'tall',
      },
      a: {
        color: props.colorMode === 'dark' ? 'teal.300' : 'teal.500',
      },
      'h2': {
        fontSize: '20px',
        fontWeight: "bold",
        color: props.colorMode === 'dark'? 'purple.300' : 'purple.600'
      },
      'h1': {
        fontSize: '30px',
        fontWeight: 800,
        color: props.colorMode === 'dark' ? 'white' : 'gray.600',
      },
    }),
  },
})