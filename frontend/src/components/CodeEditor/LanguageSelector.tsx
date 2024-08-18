import { Button, MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { LanguageCode } from '../../utils/codeExamples';
import { useSettings } from '../../context/EditorContext';

const languageModes: Record<LanguageCode, string> = {
  javascript: 'javascript',
  python: 'python',
  c: 'text/x-csrc',
  typescript: 'javascript',
  markdown: 'markdown',
  html: 'xml',
};

// animation variants

const LanguageSelector = () => {
  const { setLanguage, language } = useSettings()!;

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
          Language
        </MenuButton>
        <MenuList>
          {Object.keys(languageModes).map((lang) => (
            <MenuItem
              bg={language === lang ? 'purple.900' : 'orange.100'}
              color={language === lang ? 'white' : 'black'}
              fontSize="xs"
              key={lang}
              onClick={() => setLanguage(lang as LanguageCode)}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default LanguageSelector;
