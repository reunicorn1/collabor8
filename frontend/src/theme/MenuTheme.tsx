import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  list: {
    // this will style the MenuList component
    py: '4',
    borderRadius: 'xl',
    border: 'none',
    bg: 'orange.500',
  },
  item: {
    // this will style the MenuItem and MenuItemOption components
    fontFamily: 'mono',
    opacity: '0.8',
    color: 'black',
    _hover: {
      color: 'white',
      bg: 'purple.900',
    },
  },
  groupTitle: {
    // this will style the text defined by the title prop
    // in the MenuGroup and MenuOptionGroup components
    textTransform: 'uppercase',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 'wider',
    opacity: '0.7',
  },
  divider: {
    // this will style the MenuDivider component
    my: '4',
    borderColor: 'white',
    borderBottom: '2px dotted',
  },
});

export const menuTheme = defineMultiStyleConfig({
  baseStyle,
});
