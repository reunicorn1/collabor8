import { Button, MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { useSettings } from '@context/EditorContext';

const themes: Record<string, string> = {
  dracula: 'Dracula',
  eclipse: 'Eclipse',
  material: 'Material',
  monokai: 'Monokai',
  solarized: 'Solarized',
  twilight: 'Twilight',
  zenburn: 'Zenburn',
};

const ThemeSelector = () => {
  const { setTheme, theme } = useSettings()!;

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          colorScheme="whiteAlpha"
          color="white"
          variant="outline"
          size="xs"
          ml={3}
        >
          Theme
        </MenuButton>
        <MenuList>
          {Object.keys(themes).map((themeKey, index) => (
            <MenuItem
              bg={themeKey === theme ? 'purple.900' : 'orange.100'}
              color={themeKey === theme ? 'white' : 'black'}
              fontSize="xs"
              key={index}
              onClick={() => setTheme(themeKey)}
            >
              {themes[themeKey]}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default ThemeSelector;
